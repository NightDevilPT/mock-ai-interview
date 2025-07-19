import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

import {
	TranslationEnum,
	TranslationErrorEnum,
} from "@/interface/translation-enums";
import { ApiResponse } from "@/interface/api-response.interface";
import { withRequestTiming } from "@/middlewares/with-timestemp";
import { IUpdatePassword } from "@/interface/user.interface";


async function updatePasswordHandler(
	request: Request
): Promise<NextResponse<ApiResponse>> {
	try {
		const { email, otp, password }: IUpdatePassword = await request.json();

		// Basic validations
		if (!email || !otp || !password) {
			return NextResponse.json(
				{ message: TranslationErrorEnum.ALL_FIELDS_ARE_REQUIRED },
				{ status: 400 }
			);
		}

		// Check user existence
		const user = await prisma.user.findUnique({ where: { email } });

		if (!user) {
			return NextResponse.json(
				{ message: TranslationErrorEnum.USER_DOES_NOT_EXIST },
				{ status: 404 }
			);
		}

		// Validate OTP
		if (user.token !== otp) {
			return NextResponse.json(
				{ message: TranslationErrorEnum.INVALID_OTP },
				{ status: 400 }
			);
		}

		// Validate OTP expiration
		if (user.tokenExpired && new Date() > user.tokenExpired) {
			return NextResponse.json(
				{ message: TranslationErrorEnum.OTP_EXPIRED },
				{ status: 400 }
			);
		}

		// Hash the new password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Update user password and mark verified if not already
		await prisma.user.update({
			where: { email },
			data: {
				password: hashedPassword,
				isVerified: true,
				token: null,
				tokenExpired: null,
			},
		});

		return NextResponse.json(
			{ message: TranslationEnum.PASSWORD_UPDATED_SUCCESSFULLY },
			{ status: 200 }
		);
	} catch (error: any) {
		console.error("Error updating password:", error);
		return NextResponse.json(
			{ message: TranslationErrorEnum.INTERNAL_SERVER_ERROR },
			{ status: 500 }
		);
	}
}

// Export the POST route
export const POST = withRequestTiming(updatePasswordHandler);
