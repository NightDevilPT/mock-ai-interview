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
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import ApiService from "@/services/api.service";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { FaApple, FaGoogle, FaMeta } from "react-icons/fa6";
import { ApiEndpoints } from "@/interface/api-response.interface";

// Form validation schema
const formSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(8, {
		message: "Password must be at least 8 characters",
	}),
});

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const router = useRouter();
	const { t } = useTranslation();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			// Call the login API
			const response = await ApiService.post(ApiEndpoints.LOGIN_USER, {
				email: values.email,
				password: values.password,
			});

			// Show success message
			toast.success(t(`server.success.${response.message}`));
			if (response.statusCode === 200) {
				router.push("/");
			}
		} catch (error: any) {
			console.error("Login failed:", error);
			toast.error(t(`server.error.${error.message}`));

			// Clear password field on error
			form.resetField("password");
		}
	}

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
										{t("general.welcomeToMockAiInterview")}
									</h1>
									<p className="text-muted-foreground text-balance">
										{t(
											"general.loginToYourMockAiInterviewAccount"
										)}
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
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<div className="flex items-center">
												<FormLabel>
													{t("general.password")}
												</FormLabel>
											</div>
											<FormControl>
												<Input
													type="password"
													placeholder="••••••••"
													{...field}
												/>
											</FormControl>
											<FormMessage />
											<Link
												href="/auth/update"
												className="ml-auto text-sm underline-offset-2 hover:underline"
											>
												{t("login.forgotPassword")}
											</Link>
										</FormItem>
									)}
								/>

								<Button
									type="submit"
									className="w-full"
									disabled={form.formState.isSubmitting}
								>
									{form.formState.isSubmitting
										? t("login.loggingIn")
										: t("login.login")}
								</Button>

								<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
									<span className="bg-card text-muted-foreground relative z-10 px-2">
										{t("login.orContinueWith")}
									</span>
								</div>
								<div className="grid grid-cols-3 gap-4">
									<Button
										variant="outline"
										type="button"
										className="w-full"
									>
										<FaApple className="h-4 w-4" />
										<span className="sr-only">
											{t("login.loginWithApple")}
										</span>
									</Button>
									<Button
										variant="outline"
										type="button"
										className="w-full"
									>
										<FaGoogle className="h-4 w-4" />
										<span className="sr-only">
											{t("login.loginWithGoogle")}
										</span>
									</Button>
									<Button
										variant="outline"
										type="button"
										className="w-full"
									>
										<FaMeta className="h-4 w-4" />
										<span className="sr-only">
											{t("login.loginWithMeta")}
										</span>
									</Button>
								</div>

								<div className="text-center text-sm">
									{t("login.dontHaveAnAccount")}{" "}
									<Link
										href="/auth/signup"
										className="underline underline-offset-4"
									>
										{t("general.signUp")}
									</Link>
								</div>
							</div>
						</form>
					</Form>

					<div className="bg-muted relative hidden md:block">
						<img
							src="/login.png"
							alt="Image"
							className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
