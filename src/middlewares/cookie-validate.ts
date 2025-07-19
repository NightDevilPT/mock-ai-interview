// lib/middleware/withTokenValidation.ts
import { NextRequest, NextResponse } from "next/server";
import jwtService from "@/services/jwt.service";
import { cookies } from "next/headers";
import { TranslationErrorEnum } from "@/interface/translation-enums";
import { ApiResponse } from "@/interface/api-response.interface";
import { withRequestTiming } from "./with-timestemp";

type Handler = (request: NextRequest) => Promise<NextResponse>;

export function withTokenValidation(handler: Handler): Handler {
	return async (request: NextRequest): Promise<NextResponse> => {
		try {
			const cookieStore = cookies();
			const accessToken = (await cookieStore).get("access_token")?.value;
			const refreshToken = (await cookieStore).get(
				"refresh_token"
			)?.value;

			// Case 1: No tokens at all
			if (!accessToken && !refreshToken) {
				return NextResponse.json<ApiResponse>(
					{
						message: TranslationErrorEnum.UNAUTHORIZED,
						statusCode: 401,
					},
					{ status: 401 }
				);
			}

			// Case 2: Check access token first
			if (accessToken) {
				const accessTokenValid = jwtService.verifyToken(
					accessToken,
					"access"
				);
				if (accessTokenValid) {
					return await handler(request);
				}
			}

			// Case 3: Access token expired/invalid, check refresh token
			if (refreshToken) {
				const refreshTokenValid = jwtService.verifyToken(
					refreshToken,
					"refresh"
				);

				if (refreshTokenValid) {
					// Generate new tokens
					const payload = jwtService.verifyToken(
						refreshToken,
						"refresh"
					);
					const {
						accessToken: newAccessToken,
						refreshToken: newRefreshToken,
					} = jwtService.generateToken({
						userId: payload.userId,
						email: payload.email,
					});

					// Set new cookies
					const isProd = process.env.NODE_ENV === "production";
					const response = await handler(request);

					(await cookieStore).set("access_token", newAccessToken, {
						httpOnly: true,
						secure: isProd,
						path: "/",
						sameSite: "lax",
						maxAge: 60 * 15, // 15 minutes
					});

					(await cookieStore).set("refresh_token", newRefreshToken, {
						httpOnly: true,
						secure: isProd,
						path: "/",
						sameSite: "lax",
						maxAge: 60 * 60 * 24 * 7, // 7 days
					});

					return response;
				}
			}

			// Case 4: Both tokens expired
			return NextResponse.json<ApiResponse>(
				{
					message: TranslationErrorEnum.SESSION_EXPIRED,
					statusCode: 401,
				},
				{ status: 401 }
			);
		} catch (error) {
			console.error("Token validation error:", error);
			return NextResponse.json<ApiResponse>(
				{
					message: TranslationErrorEnum.INTERNAL_SERVER_ERROR,
					statusCode: 500,
				},
				{ status: 500 }
			);
		}
	};
}
