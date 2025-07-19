// lib/middleware/withRequestTiming.ts
import { NextRequest, NextResponse } from "next/server";

type Handler = (request: NextRequest) => Promise<NextResponse>;

export function withRequestTiming(handler: Handler): Handler {
	return async (request: NextRequest): Promise<NextResponse> => {
		const startDate = new Date();
		const startHrTime = process.hrtime();

		const response = await handler(request);

		const endDate = new Date();
		const [seconds, nanoseconds] = process.hrtime(startHrTime);
		const durationMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(2);

		const finalResponse = NextResponse.json(
			{
				...(await response.json()),
				meta: {
					startTime: startDate.toLocaleString(),
					endTime: endDate.toLocaleString(),
					durationMs: `${durationMs}ms`,
				},
			},
			{
				status: response.status,
				headers: response.headers,
			}
		);

		return finalResponse;
	};
}
