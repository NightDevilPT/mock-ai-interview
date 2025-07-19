import {
	TranslationEnum,
	TranslationErrorEnum,
} from "@/interface/translation-enums";
import { config } from "@/config";
import prisma from "@/lib/prisma";
import { generateOtp } from "@/lib/utils";
import { NextResponse } from "next/server";
import { validateEmail } from "@/lib/validator";
import { ApiResponse } from "@/interface/api-response.interface";
import { withRequestTiming } from "@/middlewares/with-timestemp";
import { getOtpEmailTemplate } from "@/templates/otp-mail.template";
import { emailProviderFactory } from "@/services/email-provider.service";

async function resendVerifyHandler(request: Request) {
	try {
		const body = await request.json();
		const { email, type } = body;

		if (!email) {
			const res: ApiResponse = {
				message: TranslationErrorEnum.EMAIL_IS_REQUIRED,
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

		if (user.isVerified && type !== "update-password") {
			const res: ApiResponse = {
				message: TranslationErrorEnum.USER_ALREADY_VERIFIED,
				statusCode: 200,
			};
			return NextResponse.json(res, { status: 200 });
		}

		const otp = generateOtp();
		const otpExpireAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
		const currentYear = new Date().getFullYear().toString();

		await prisma.user.update({
			where: { email },
			data: {
				token: otp.toString(),
				tokenExpired: otpExpireAt,
			},
		});

		const transporter = emailProviderFactory("gmail");
		const emailOptions = {
			from: config.emailId,
			to: email,
			subject:
				type === "update-password"
					? "Update Password Email"
					: "Resend Email Verification",
			html: getOtpEmailTemplate(
				`${user.firstName} ${user.lastName}`,
				otp,
				currentYear
			),
		};

		await transporter.sendMail(emailOptions);

		const res: ApiResponse = {
			message:
				type === "update-password"
					? TranslationEnum.OTP_SENT_FOR_PASSWORD_RESET
					: TranslationEnum.VERIFICATION_MAIL_SENT,
			statusCode: 200,
		};
		return NextResponse.json(res, { status: 200 });
	} catch (error: any) {
		console.error("Error in resend verification:", error);
		const res: ApiResponse = {
			message: TranslationErrorEnum.INTERNAL_SERVER_ERROR,
			statusCode: 500,
			errors: [error?.message || "Unexpected error occurred"],
		};
		return NextResponse.json(res, { status: 500 });
	}
}

export const POST = withRequestTiming(resendVerifyHandler);
