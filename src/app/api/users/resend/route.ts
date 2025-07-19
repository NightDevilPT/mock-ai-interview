import { NextResponse } from "next/server";
import { emailProviderFactory } from "@/services/email-provider.service";
import { getOtpEmailTemplate } from "@/templates/otp-mail.template";
import { config } from "@/config";
import prisma from "@/lib/prisma";
import { generateOtp } from "@/lib/utils";
import {
	TranslationEnum,
	TranslationErrorEnum,
} from "@/interface/translation-enums";
import { ApiResponse } from "@/interface/api-response.interface";
import { validateEmail } from "@/lib/validator";
import { withRequestTiming } from "@/middlewares/with-timestemp";

async function resendVerifyHandler(request: Request) {
	try {
		const body = await request.json();
		const { email } = body;

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

		if (user.isVerified) {
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
			subject: "Resend Email Verification",
			html: getOtpEmailTemplate(
				`${user.firstName} ${user.lastName}`,
				otp,
				currentYear
			),
		};

		await transporter.sendMail(emailOptions);

		const res: ApiResponse = {
			message: TranslationEnum.VERIFICATION_MAIL_SENT,
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
