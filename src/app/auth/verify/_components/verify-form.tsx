"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useEffect } from "react";
import { InputOTPWithSeparator } from "@/components/atoms/out-input";

// Form validation schema
const formSchema = z.object({
	email: z.string().email("Invalid email address"),
	otp: z.string().min(6, {
		message: "Your one-time password must be 6 characters.",
	}),
});

export function VerifyEmailForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { t } = useTranslation();

	// Pre-fill email from query params if available
	const email = searchParams.get("email");

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: email || "",
			otp: "",
		},
	});

	// Auto-submit when OTP is complete
	useEffect(() => {
		if (form.watch("otp").length === 6) {
			form.handleSubmit(onSubmit)();
		}
	}, [form.watch("otp")]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			console.log("Form values:", values);
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: t("verify.errorMessage")
			);
			form.resetField("otp");
		}
	}

	async function resendOTP() {
		try {
			console.log("Resending OTP to:", form.getValues("email"));
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: t("verify.resendErrorMessage")
			);
		}
	}

	// Handle OTP change
	const handleOTPChange = (otpValue: string) => {
		form.setValue("otp", otpValue); // Set OTP value in form state
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className="overflow-hidden p-0">
				<CardContent className="grid p-0 md:grid-cols-2">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="p-6 md:p-8"
						>
							<div className="flex flex-col gap-6">
								<div className="flex flex-col items-center text-center">
									<h1 className="text-2xl font-bold">
										{t("verify.verifyEmail")}
									</h1>
									<p className="text-muted-foreground text-balance">
										{t("verify.enterCodeMessage")}
									</p>
								</div>

								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												{t("general.email")}
											</FormLabel>
											<FormControl>
												<Input
													placeholder="m@example.com"
													type="email"
													{...field}
													disabled={!!email} // Disable if email is from query params
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="otp"
									render={({ field }) => (
										<FormItem className="mx-auto">
											<FormLabel>
												{t("verify.oneTimePassword")}
											</FormLabel>
											<FormControl>
												<InputOTPWithSeparator
													onChange={handleOTPChange}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button
									type="submit"
									className="w-full"
									disabled={form.formState.isSubmitting}
								>
									{form.formState.isSubmitting
										? t("verify.verifying")
										: t("verify.verifyEmail")}
								</Button>

								<div className="text-center text-sm">
									<span className="text-muted-foreground">
										{t("verify.didntReceiveCode")}{" "}
									</span>
									<button
										type="button"
										onClick={resendOTP}
										className="underline underline-offset-4 hover:text-primary"
										disabled={form.formState.isSubmitting}
									>
										{t("verify.resendCode")}
									</button>
								</div>

								<div className="text-center text-sm">
									<Link
										href="/auth/login"
										className="underline underline-offset-4 hover:text-primary"
									>
										{t("general.backToLogin")}
									</Link>
								</div>
							</div>
						</form>
					</Form>

					<div className="bg-muted relative hidden md:block">
						<img
							src="/verify.png"
							alt="Email verification illustration"
							className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
