import { Session, SessionResponse } from "@/interface/interview-session.interface";
import prisma from "@/lib/prisma";
import { withTokenValidation } from "@/middlewares/cookie-validate";
import { withRequestTiming } from "@/middlewares/with-timestemp";
import { NextRequest, NextResponse } from "next/server";
import type { TokenPayload } from "@/middlewares/cookie-validate";

// Factory function to provide 'params' into the real handler
function getSessionByIdHandler(params: Promise<{ id: string }>) {
    return async (
        request: NextRequest,
        payload?: TokenPayload
    ): Promise<NextResponse> => {
        if (request.method !== "GET") {
            return NextResponse.json(
                { message: "Method Not Allowed", status: 405, data: null },
                { status: 405 }
            );
        }

        try {
            // Await the params Promise to get the actual parameters
            const { id } = await params;
            
            // You may use payload for user checks: payload?.userId
            const session = await prisma.interviewSession.findUnique({
                where: { id }, // Use the awaited id
                include: {
                    creator: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            avatar: true,
                        },
                    },
                    questions: {
                        orderBy: { order: "asc" },
                    },
                    _count: {
                        select: { questions: true, attempts: true },
                    },
                },
            });

            if (!session) {
                return NextResponse.json(
                    { data: null, status: 404, message: "Session not found" },
                    { status: 404 }
                );
            }

            const data: SessionResponse["data"] = {
                id: session.id,
                title: session.title,
                description: session.description ?? "",
                careerLevel: session.careerLevel,
                experience: session.experience,
                domain: session.domain,
                difficulty: session.difficulty,
                questionTypes: session.questionTypes,
                focusAreas: session.focusAreas,
                isPublic: session.isPublic,
                shareToken: session.shareToken ?? null,
                status: session.status,
                totalQuestions:
                    session.totalQuestions ?? session.questions.length,
                totalPoints:
                    session.totalPoints ??
                    session.questions.reduce(
                        (sum, q) => sum + (q.points ?? 0),
                        0
                    ),
                creatorId: session.creatorId,
                createdAt: session.createdAt.toISOString(),
                updatedAt: session.updatedAt.toISOString(),
                creator: {
                    id: session.creator.id,
                    email: session.creator.email,
                    firstName: session.creator.firstName,
                    lastName: session.creator.lastName,
                    avatar: session.creator.avatar ?? null,
                },
                questions: session.questions.map((q) => ({
                    id: q.id,
                    text: q.text,
                    type: q.type,
                    difficulty: q.difficulty,
                    points: q.points,
                    order: q.order ?? null,
                    category: q.category ?? null,
                    estimatedDuration: q.estimatedDuration ?? null,
                    options: q.options ?? [],
                    constraints: q.constraints ?? null,
                    hints: q.hints ?? [],
                    tags: q.tags ?? [],
                    content: q.content ?? null,
                    createdAt: q.createdAt.toISOString(),
                    updatedAt: q.updatedAt.toISOString(),
                })),
                _count: session._count,
            } as Session;

            return NextResponse.json(
                {
                    data,
                    status: 200,
                    message: "Session retrieved successfully",
                },
                { status: 200 }
            );
        } catch (error) {
            console.error("Error fetching session:", error);
            return NextResponse.json(
                { data: null, status: 500, message: "Internal Server Error" },
                { status: 500 }
            );
        }
    };
}

// App Router expects a function like: (request, { params })
export const GET = (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) =>
    withRequestTiming(withTokenValidation(getSessionByIdHandler(params)))(
        request
    );
