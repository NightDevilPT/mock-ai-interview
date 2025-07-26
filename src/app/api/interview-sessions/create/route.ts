import {
	TokenPayload,
	withTokenValidation,
} from "@/middlewares/cookie-validate";
import {
	CareerLevelEnum,
	InterviewPromptSchema,
	QuestionDifficulty,
	SessionStatus,
} from "@/interface/interview-session.interface";
import prisma from "@/lib/prisma";
import { model } from "@/lib/gemini-model";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/interface/api-response.interface";
import { withRequestTiming } from "@/middlewares/with-timestemp";
import { TranslationErrorEnum } from "@/interface/translation-enums";
import { generateInterviewPrompt } from "@/prompts/create-session.prompt";

// Dummy Response Json
import dummyRes from "../../../../dummy-response/session.json";

async function createSession(request: Request, payload?: TokenPayload) {
	try {
		if (!payload) {
			const res: ApiResponse = {
				statusCode: 401,
				message: TranslationErrorEnum.UNAUTHORIZED,
			};
			return NextResponse.json(res, { status: 401 });
		}

		// Parse and validate input
		const rawParams = await request.json();
		const validationResult = InterviewPromptSchema.safeParse(rawParams);

		if (!validationResult.success) {
			const res: ApiResponse = {
				statusCode: 400,
				message: TranslationErrorEnum.INVALID_INPUT,
				error: JSON.parse(validationResult.error.message),
			};
			return NextResponse.json(res, { status: 400 });
		}

		const validatedParams = validationResult.data;

		// Generate prompt with validated params
		const prompt = await generateInterviewPrompt.format({
			...validatedParams,
			questionTypes: validatedParams.questionTypes,
			focusAreas: validatedParams.focusAreas,
		});

		// Generate AI Response (or use dummy in development)
		let parsedResponse;
		if (process.env.NODE_ENV === "development") {
			console.log("Using dummy response for development");
			parsedResponse = dummyRes;
		} else {
			console.log("Generating interview session using AI model");
			const response = await model.invoke(prompt);
			const rawContent = response.content.toString();
			const cleanedResponse = rawContent.startsWith("```json")
				? rawContent.replace(/^```json\n/, "").replace(/\n```$/, "")
				: rawContent;
			parsedResponse = JSON.parse(cleanedResponse);
		}

		const session = await prisma.interviewSession.create({
			data: {
				title: validatedParams.title,
				description: validatedParams.description,
				careerLevel: validatedParams.careerLevel as CareerLevelEnum,
				experience: validatedParams.experience,
				domain: validatedParams.domain,
				difficulty: validatedParams.difficulty as QuestionDifficulty,
				questionTypes: validatedParams.questionTypes,
				focusAreas: validatedParams.focusAreas,
				totalQuestions: parsedResponse.metadata.totalQuestions,
				totalPoints: parsedResponse.metadata.totalPoints,
				status: SessionStatus.GENERATED,
				creatorId: payload.userId,
			},
		});

		// 2. Then create questions in batches (if many)
		const batchSize = 10;
		const questionPromises = [];

		for (let i = 0; i < parsedResponse.questions.length; i += batchSize) {
			const batch = parsedResponse.questions.slice(i, i + batchSize);
			questionPromises.push(
				prisma.question.createMany({
					data: batch.map((question: any, index: number) => ({
						text: question.text,
						content: question.content,
						type: question.type,
						category: question.category,
						difficulty: question.difficulty,
						estimatedDuration: question.estimatedDuration,
						order: question.order || index + 1,
						points: question.points,
						options: question.options || [],
						constraints: question.constraints || {},
						hints: question.hints || [],
						tags: question.tags || [],
						sessionId: session.id,
					})),
				})
			);
		}

		await Promise.all(questionPromises);

		// 3. Update user stats
		await prisma.user.update({
			where: { id: payload.userId },
			data: { totalSessionsCreated: { increment: 1 } },
		});

		// Get all question IDs (if needed)
		const questions = await prisma.question.findMany({
			where: { sessionId: session.id },
			select: { id: true },
		});

		const res: ApiResponse = {
			statusCode: 201,
			message: "Interview session created successfully",
			data: {
				...parsedResponse,
				sessionId: session.id,
				questionIds: questions.map((q) => q.id),
			},
			meta:{
				questions:questions.length
			}
		};
		return NextResponse.json(res, { status: 201 });
	} catch (error: any) {
		console.error("Error during interview generation:", error);
		return NextResponse.json(
			{
				message: TranslationErrorEnum.INTERNAL_SERVER_ERROR,
				error: error.message,
			},
			{ status: 500 }
		);
	}
}

export const POST = withRequestTiming(withTokenValidation(createSession));
