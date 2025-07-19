import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
	TranslationEnum,
	TranslationErrorEnum,
} from "@/interface/translation-enums";

import { cookies } from "next/headers"; // for setting cookies
import jwtService from "@/services/jwt.service";
import { ILogin, UserPayload } from "@/interface/user.interface";
import { ApiResponse } from "@/interface/api-response.interface";
import { withRequestTiming } from "@/middlewares/with-timestemp";
import { validateEmail, validatePasswordWithErrors } from "@/lib/validator";

async function loginHandler(request: Request) {
	try {
		const { email, password }: ILogin = await request.json();

		if (!email || !password) {
			return NextResponse.json(
				{ message: TranslationErrorEnum.ALL_FIELDS_ARE_REQUIRED },
				{ status: 400 }
			);
		}

		if (!validateEmail(email)) {
			return NextResponse.json(
				{ message: TranslationErrorEnum.INVALID_EMAIL_FORMAT },
				{ status: 400 }
			);
		}

		const { isValid, error } = validatePasswordWithErrors(password);
		if (!isValid) {
			return NextResponse.json(
				{
					message: error,
				},
				{ status: 400 }
			);
		}

		const user = await prisma.user.findUnique({
			where: { email },
			select: {
				password: true,
				isVerified: true,
				id: true,
				email: true,
				firstName: true,
				lastName: true,
			},
		});

		if (!user) {
			return NextResponse.json(
				{ message: TranslationErrorEnum.USER_DOES_NOT_EXIST },
				{ status: 404 }
			);
		}

		if (!user.isVerified) {
			return NextResponse.json(
				{ message: TranslationErrorEnum.USER_NOT_VERIFIED },
				{ status: 403 }
			);
		}

		if (!user.password) {
			return NextResponse.json(
				{ message: TranslationErrorEnum.INVALID_CREDENTIALS },
				{ status: 401 }
			);
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return NextResponse.json(
				{ message: TranslationErrorEnum.INVALID_CREDENTIALS },
				{ status: 401 }
			);
		}

		// ✅ Generate Tokens
		const payload = { userId: user.id, email: user.email };
		const { accessToken, refreshToken } = jwtService.generateToken(payload);

		// ✅ Set tokens as HTTP-only cookies
		const cookieStore = cookies();
		const isProd = process.env.NODE_ENV === "production";

		(await cookieStore).set("access_token", accessToken, {
			httpOnly: true,
			secure: isProd,
			path: "/",
			sameSite: "lax",
			maxAge: 60 * 15, // 15 minutes
		});

		(await cookieStore).set("refresh_token", refreshToken, {
			httpOnly: true,
			secure: isProd,
			path: "/",
			sameSite: "lax",
			maxAge: 60 * 20, // 20 minutes
		});

		// ✅ Return success response
		return NextResponse.json<ApiResponse<{ user: UserPayload }>>(
			{
				message: TranslationEnum.USER_LOGGED_IN_SUCCESSFULLY,
				data: {
					user: {
						id: user.id,
						email: user.email,
						firstName: user.firstName,
						lastName: user.lastName,
						isVerified: user.isVerified,
					},
				},
				statusCode: 200,
			},
			{ status: 200 }
		);
	} catch (error: any) {
		console.error("Error during login:", error);
		return NextResponse.json(
			{ message: TranslationErrorEnum.INTERNAL_SERVER_ERROR },
			{ status: 500 }
		);
	}
}

// Export the POST handler wrapped with request timing middleware
export const POST = withRequestTiming(loginHandler);