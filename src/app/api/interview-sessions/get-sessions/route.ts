import {
	TokenPayload,
	withTokenValidation,
} from "@/middlewares/cookie-validate";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/interface/api-response.interface";
import { withRequestTiming } from "@/middlewares/with-timestemp";
import { TranslationErrorEnum } from "@/interface/translation-enums";

async function getPublicSessions(request: Request, payload?: TokenPayload) {
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
		const search = searchParams.get("search");
		const domain = searchParams.get("domain");
		const difficulty = searchParams.get("difficulty");

		// Calculate pagination
		const skip = (page - 1) * limit;

		// Build where clause - only public sessions
		const where: any = {
			isPublic: true,
			status: "GENERATED",
		};

		// Optional filters
		if (search) {
			where.OR = [
				{ title: { contains: search, mode: "insensitive" } },
				{ description: { contains: search, mode: "insensitive" } },
			];
		}

		if (domain) {
			where.domain = domain;
		}

		if (difficulty) {
			where.difficulty = difficulty;
		}

		// Get public sessions
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
							firstName: true,
							lastName: true,
							avatar: true,
						},
					},
					_count: {
						select: { questions: true },
					},
				},
			}),
			prisma.interviewSession.count({ where }),
		]);

		const totalPages = Math.ceil(totalRecords / limit);

		const response: ApiResponse = {
			statusCode: 200,
			message: "Public sessions retrieved successfully",
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
		console.error("Error fetching public sessions:", error);
		const res: ApiResponse = {
			statusCode: 500,
			message: "Internal server error",
			error: error.message,
		};
		return NextResponse.json(res, { status: 500 });
	}
}

export const GET = withRequestTiming(withTokenValidation(getPublicSessions));
