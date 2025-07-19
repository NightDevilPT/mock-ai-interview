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

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			// Call the verify OTP API
			const response = await ApiService.post(ApiEndpoints.VERIFY_USER, {
				email: values.email,
				otp: values.otp,
			});

			// Show success message
			toast.success(t(`server.success.${response.message}`));

			if (response.statusCode === 200) {
				router.push("/auth/login");
			}
		} catch (error: any) {
			console.error("OTP verification failed:", error);

			toast.error(t(`server.error.${error.message}`));
		}
	}

	async function resendOTP() {
		try {
			const email = form.getValues("email");
			if (!email) {
				toast.error(t("verify.emailRequired"));
				return;
			}

			// Call the resend OTP API
			const response = await ApiService.post(ApiEndpoints.RESEND_OTP, {
				email,
			});

			toast.success(t(`server.success.${response.message}`));
		} catch (error: any) {
			console.error("Resend OTP failed:", error);
			toast.error(t(`server.error.${error.message}`));
		}
	}

	// Handle OTP change
	const handleOTPChange = (otpValue: string) => {
		form.setValue("otp", otpValue);
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
													disabled={!!email}
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
