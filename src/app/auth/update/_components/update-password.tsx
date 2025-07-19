"use client";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import ApiService from "@/services/api.service";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiEndpoints } from "@/interface/api-response.interface";
import { InputOTPWithSeparator } from "@/components/atoms/out-input";

const formSchema = z
	.object({
		email: z.string().email("Invalid email address"),
		otp: z.string().min(6, {
			message: "Your one-time password must be 6 characters",
		}),
		newPassword: z.string().min(8, {
			message: "Password must be at least 8 characters",
		}),
		confirmPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export function UpdatePasswordForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { t } = useTranslation();
	const [isOtpSent, setIsOtpSent] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Pre-fill email from query params if available
	const email = searchParams.get("email");

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: email || "",
			otp: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	const sendOtp = async () => {
		const email = form.getValues("email");
		if (!email) {
			toast.error(t("updatePassword.emailRequired"));
			return;
		}

		try {
			setIsSubmitting(true);
			const response = await ApiService.post(ApiEndpoints.RESEND_OTP, {
				email,
				type: "update-password",
			});

			toast.success(t(`server.success.${response.message}`));
			setIsOtpSent(true);
		} catch (error: any) {
			console.error("Failed to send OTP:", error);
			toast.error(t(`server.error.${error.message}`));
		} finally {
			setIsSubmitting(false);
		}
	};

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			setIsSubmitting(true);
			const response = await ApiService.post(
				ApiEndpoints.UPDATE_USER_PASSWORD,
				{
					email: values.email,
					otp: values.otp,
					password: values.newPassword,
				}
			);

			toast.success(t(`server.success.${response.message}`));
			router.push("/auth/login");
		} catch (error: any) {
			console.error("Password update failed:", error);
			toast.error(t(`server.error.${error.message}`));
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className="overflow-hidden p-0">
				<CardContent className="grid p-0 md:grid-cols-2">
					<div className="bg-muted relative hidden md:block">
						<img
							src="/verify.png"
							alt="Update password illustration"
							className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
						/>
					</div>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="p-6 md:p-8"
						>
							<div className="flex flex-col gap-6">
								<div className="flex flex-col items-center text-center">
									<h1 className="text-2xl font-bold">
										{t("updatePassword.title")}
									</h1>
									<p className="text-muted-foreground text-balance">
										{t("updatePassword.subtitle")}
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
												<div className="flex gap-2">
													<Input
														placeholder="m@example.com"
														type="email"
														{...field}
														disabled={
															!!email || isOtpSent
														}
													/>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{!isOtpSent ? (
									<Button
										type="button"
										onClick={sendOtp}
										disabled={isSubmitting}
									>
										{isSubmitting
											? t("updatePassword.sendingOtp")
											: t("updatePassword.sendOtp")}
									</Button>
								) : (
									<>
										<FormField
											control={form.control}
											name="otp"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														{t(
															"verify.oneTimePassword"
														)}
													</FormLabel>
													<FormControl>
														<InputOTPWithSeparator
															onChange={(value) =>
																field.onChange(
																	value
																)
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="newPassword"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														{t(
															"updatePassword.newPassword"
														)}
													</FormLabel>
													<FormControl>
														<Input
															type="password"
															placeholder="••••••••"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="confirmPassword"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														{t(
															"updatePassword.confirmPassword"
														)}
													</FormLabel>
													<FormControl>
														<Input
															type="password"
															placeholder="••••••••"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<Button
											type="submit"
											className="w-full"
											disabled={isSubmitting}
										>
											{isSubmitting
												? t("updatePassword.updating")
												: t(
														"updatePassword.updateButton"
												  )}
										</Button>
									</>
								)}

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
				</CardContent>
			</Card>
		</div>
	);
}
