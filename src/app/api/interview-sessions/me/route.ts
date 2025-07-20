import {
	TokenPayload,
	withTokenValidation,
} from "@/middlewares/cookie-validate";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/interface/api-response.interface";
import { withRequestTiming } from "@/middlewares/with-timestemp";
import { TranslationErrorEnum } from "@/interface/translation-enums";

async function getSessions(request: Request, payload?: TokenPayload) {
	try {
		if (!payload) {
			const res: ApiResponse = {
				statusCode: 401,
				message: TranslationErrorEnum.UNAUTHORIZED,
			};
			return NextResponse.json(res, { status: 401 });
		}

		// Get query parameters
		const { searchParams } = new URL(request.url);
		const page = Number(searchParams.get("page")) || 1;
		const limit = Number(searchParams.get("limit")) || 10;
		const status = searchParams.get("status");
		const search = searchParams.get("search");

		// Calculate pagination
		const skip = (page - 1) * limit;

		// Build where clause
		const where: any = {
			creatorId: payload.userId,
		};

		if (status) {
			where.status = status;
		}

		if (search) {
			where.OR = [
				{ title: { contains: search, mode: "insensitive" } },
				{ domain: { contains: search, mode: "insensitive" } },
			];
		}

		// Get sessions with creator and questions
		const [sessions, totalRecords] = await Promise.all([
			prisma.interviewSession.findMany({
				where,
				skip,
				take: limit,
				orderBy: { createdAt: "desc" },
				include: {
					creator: {
						select: {
							id: true,
							email: true,
							avatar: true,
							firstName: true,
							lastName: true,
						},
					},
					questions: {
						select: {
							id: true,
							text: true,
							type: true,
							difficulty: true,
							points: true,
							order: true,
						},
						orderBy: { order: "asc" },
					},
					_count: {
						select: { questions: true, attempts: true },
					},
				},
			}),
			prisma.interviewSession.count({ where }),
		]);

		const totalPages = Math.ceil(totalRecords / limit);

		const response: ApiResponse = {
			statusCode: 200,
			message: "Sessions retrieved successfully",
			data: {
				sessions,
			},
			meta: {
				page,
				limit,
				totalRecords,
				totalPages,
				isPrevious: page > 1,
				isNext: page < totalPages,
			},
		};

		return NextResponse.json(response);
	} catch (error: any) {
		console.error("Error fetching sessions:", error);
		const res: ApiResponse = {
			statusCode: 500,
			message: TranslationErrorEnum.INTERNAL_SERVER_ERROR,
			error: error.message,
		};
		return NextResponse.json(res, { status: 500 });
	}
}

export const GET = withRequestTiming(withTokenValidation(getSessions));
