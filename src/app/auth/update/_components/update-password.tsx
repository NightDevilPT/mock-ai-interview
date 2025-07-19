"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useState } from "react";
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
	const [isOtpSent, setIsOtpSent] = useState(true);

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

	const sendOtp = () => {
		const email = form.getValues("email");
		if (!email) {
			toast.error("Please enter your email first");
			return;
		}
		console.log("OTP would be sent to:", email);
		toast.success("OTP sent successfully (demo)");
		setIsOtpSent(true);
	};

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		console.log("Form would be submitted with:", values);
		toast.success("Password updated successfully (demo)");
		router.push("/login");
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

								{!isOtpSent && (
									<Button type="button" onClick={sendOtp}>
										{t("updatePassword.sendOtp")}
									</Button>
								)}

								{isOtpSent && (
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
									</>
								)}

								{isOtpSent && (
									<Button type="submit" className="w-full">
										{t("updatePassword.updateButton")}
									</Button>
								)}

								<div className="text-center text-sm">
									<Link
										href="/login"
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
