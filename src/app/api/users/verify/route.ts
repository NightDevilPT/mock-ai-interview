import {
	TranslationEnum,
	TranslationErrorEnum,
} from "@/interface/translation-enums";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { IVerifyUser } from "@/interface/user.interface";
import { ApiResponse } from "@/interface/api-response.interface";
import { withRequestTiming } from "@/middlewares/with-timestemp";

async function verifyHandler(request: Request) {
	try {
		const { email, otp }: IVerifyUser = await request.json();

		// Basic field validation
		if (!email || !otp) {
			const res: ApiResponse = {
				message: TranslationErrorEnum.ALL_FIELDS_ARE_REQUIRED,
				statusCode: 400,
			};
			return NextResponse.json(res, { status: 400 });
		}

		// Check if user exists
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			const res: ApiResponse = {
				message: TranslationErrorEnum.USER_DOES_NOT_EXIST,
				statusCode: 404,
			};
			return NextResponse.json(res, { status: 404 });
		}

		// Check if user is already verified
		if (user.isVerified) {
			const res: ApiResponse = {
				message: TranslationErrorEnum.USER_ALREADY_VERIFIED,
				statusCode: 200,
			};
			return NextResponse.json(res, { status: 400 });
		}

		// Check OTP validity and expiration
		if (user.token !== otp) {
			const res: ApiResponse = {
				message: TranslationErrorEnum.INVALID_OTP,
				statusCode: 400,
			};
			return NextResponse.json(res, { status: 400 });
		}

		if (user.tokenExpired && new Date() > user.tokenExpired) {
			const res: ApiResponse = {
				message: TranslationErrorEnum.OTP_EXPIRED,
				statusCode: 400,
			};
			return NextResponse.json(res, { status: 400 });
		}

		// Update user as verified
		await prisma.user.update({
			where: { email },
			data: {
				isVerified: true,
				token: null,
				tokenExpired: null,
			},
		});

		const res: ApiResponse = {
			message: TranslationEnum.USER_VERIFIED_SUCCESSFULLY,
			statusCode: 200,
		};
		return NextResponse.json(res, { status: 200 });
	} catch (error: any) {
		console.error("Error verifying user:", error);
		return NextResponse.json(
			{ message: TranslationErrorEnum.INTERNAL_SERVER_ERROR },
			{ status: 500 }
		);
	}
}

// Export the POST handler wrapped with request timing middleware
export const POST = withRequestTiming(verifyHandler);
