import {
	TranslationErrorEnum,
	TranslationEnum,
} from "@/interface/translation-enums";
import { config } from "@/config";
import prisma from "@/lib/prisma";
import { generateOtp } from "@/lib/utils";
import { NextResponse } from "next/server";
import { validateEmail } from "@/lib/validator";
import { IForgotPassword } from "@/interface/user.interface";
import { ApiResponse } from "@/interface/api-response.interface";
import { withRequestTiming } from "@/middlewares/with-timestemp";
import { getOtpEmailTemplate } from "@/templates/otp-mail.template";
import { emailProviderFactory } from "@/services/email-provider.service";

async function forgotPasswordHandler(request: Request) {
	try {
		const { email }: IForgotPassword = await request.json();

		// 1. Basic validation
		if (!email) {
			const res: ApiResponse = {
				message: TranslationErrorEnum.ALL_FIELDS_ARE_REQUIRED,
				statusCode: 400,
			};
			return NextResponse.json(res, { status: 400 });
		}

		if (!validateEmail(email)) {
			const res: ApiResponse = {
				message: TranslationErrorEnum.INVALID_EMAIL_FORMAT,
				statusCode: 400,
			};
			return NextResponse.json(res, { status: 400 });
		}

		// 2. User existence check
		const user = await prisma.user.findUnique({ where: { email } });

		if (!user) {
			const res: ApiResponse = {
				message: TranslationErrorEnum.USER_DOES_NOT_EXIST,
				statusCode: 404,
			};
			return NextResponse.json(res, { status: 404 });
		}

		// 3. Generate OTP and expiry
		const otp = generateOtp();
		const otpExpireAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

		await prisma.user.update({
			where: { email },
			data: {
				token: otp.toString(),
				tokenExpired: otpExpireAt,
			},
		});

		// 4. Send reset password email
		const transporter = emailProviderFactory("gmail");
		const emailOptions = {
			from: config.emailId,
			to: email,
			subject: "Reset Your Password",
			html: getOtpEmailTemplate(
				`${user.firstName} ${user.lastName}`,
				otp,
				new Date().getFullYear().toString()
			),
		};

		await transporter.sendMail(emailOptions);

		// 5. Success response
		const res: ApiResponse = {
			message: TranslationEnum.OTP_SENT_FOR_PASSWORD_RESET,
			statusCode: 200,
		};

		return NextResponse.json(res, { status: 200 });
	} catch (error: any) {
		console.error("Error in forgot-password:", error);
		const res: ApiResponse = {
			message: TranslationErrorEnum.INTERNAL_SERVER_ERROR,
			statusCode: 500,
			errors: [error?.message || "Unexpected error occurred"],
		};
		return NextResponse.json(res, { status: 500 });
	}
}

export const POST = withRequestTiming(forgotPasswordHandler);
