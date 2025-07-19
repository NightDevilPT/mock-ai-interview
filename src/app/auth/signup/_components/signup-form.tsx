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
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import ApiService from "@/services/api.service";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { FaApple, FaGoogle, FaMeta } from "react-icons/fa6";
import { ApiEndpoints } from "@/interface/api-response.interface";

// Form validation schema
const formSchema = z.object({
	firstName: z.string().min(2, {
		message: "First name must be at least 2 characters",
	}),
	lastName: z.string().min(2, {
		message: "Last name must be at least 2 characters",
	}),
	email: z.string().email("Invalid email address"),
	password: z.string().min(8, {
		message: "Password must be at least 8 characters",
	}),
});

export function SignupForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const router = useRouter();
	const { t } = useTranslation();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			// Call the register API using the ApiService
			const response = await ApiService.post(ApiEndpoints.REGISTER_USER, {
				firstName: values.firstName,
				lastName: values.lastName,
				email: values.email,
				password: values.password,
			});
			toast.success(t(`server.success.${response.message}`));
			if (response.statusCode === 201) {
				router.push("/auth/login");
			}
		} catch (error: any) {
			toast.error(t(`server.error.${error.message}`));
		}
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className="overflow-hidden p-0">
				<CardContent className="grid p-0 md:grid-cols-2">
					<div className="bg-muted relative hidden md:block">
						<img
							src="/signup.png"
							alt="Signup illustration"
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
										{t("signup.createAccount")}
									</h1>
									<p className="text-muted-foreground text-balance">
										{t("signup.getStartedMessage")}
									</p>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="firstName"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													{t("general.firstName")}
												</FormLabel>
												<FormControl>
													<Input
														placeholder={t(
															"general.firstNamePlaceholder"
														)}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="lastName"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													{t("general.lastName")}
												</FormLabel>
												<FormControl>
													<Input
														placeholder={t(
															"general.lastNamePlaceholder"
														)}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
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
											<FormLabel>
												{t("general.password")}
											</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="••••••••"
													{...field}
												/>
											</FormControl>
											<FormMessage />
											<div className="text-muted-foreground text-sm">
												{t(
													"signup.passwordRequirements"
												)}
											</div>
										</FormItem>
									)}
								/>

								<Button
									type="submit"
									className="w-full"
									disabled={form.formState.isSubmitting}
								>
									{form.formState.isSubmitting
										? t("signup.creatingAccount")
										: t("general.signUp")}
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
											{t("login.signupWithApple")}
										</span>
									</Button>
									<Button
										variant="outline"
										type="button"
										className="w-full"
									>
										<FaGoogle className="h-4 w-4" />
										<span className="sr-only">
											{t("login.signupWithGoogle")}
										</span>
									</Button>
									<Button
										variant="outline"
										type="button"
										className="w-full"
									>
										<FaMeta className="h-4 w-4" />
										<span className="sr-only">
											{t("login.signupWithMeta")}
										</span>
									</Button>
								</div>

								<div className="text-center text-sm">
									{t("signup.alreadyHaveAccount")}{" "}
									<Link
										href="/auth/login"
										className="underline underline-offset-4"
									>
										{t("general.login")}
									</Link>
								</div>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>

			<div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
				{t("signup.termsAgreement")}{" "}
				<Link href="/terms">{t("general.termsOfService")}</Link>{" "}
				{t("general.and")}{" "}
				<Link href="/privacy">{t("general.privacyPolicy")}</Link>.
			</div>
		</div>
	);
}
