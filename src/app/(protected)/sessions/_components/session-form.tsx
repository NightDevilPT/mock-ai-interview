"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import {
	InterviewPromptSchema,
	InterviewPromptPayload,
	CareerLevelEnum,
	ExperienceLevelEnum,
	QuestionDifficulty,
	QuestionTypeEnum,
} from "@/interface/interview-session.interface";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import ApiService from "@/services/api.service";
import { ApiEndpoints } from "@/interface/api-response.interface";

const CareerLevels = Object.values(CareerLevelEnum);
const ExperienceLevels = Object.values(ExperienceLevelEnum);
const Difficulties = Object.values(QuestionDifficulty);
const QuestionTypes = Object.values(QuestionTypeEnum);

// Create a form schema that matches exactly what we need
const FormSchema = z.object({
	title: z.string().min(3, "Title must be at least 3 characters").max(100),
	description: z.string(),
	domain: z.string().min(2, "Domain must be at least 2 characters").max(50),
	careerLevel: z.nativeEnum(CareerLevelEnum),
	experience: z.nativeEnum(ExperienceLevelEnum),
	difficulty: z.nativeEnum(QuestionDifficulty),
	questionTypes: z.array(z.nativeEnum(QuestionTypeEnum)).min(1).max(5),
	focusAreas: z.array(z.string().min(2).max(30)).max(5),
	totalQuestions: z.number().int().min(1).max(50),
});

type FormData = z.infer<typeof FormSchema>;

interface InterviewSessionFormProps {
	defaultValues?: Partial<FormData>;
	onSuccess?: () => void;
}

interface InterviewSessionDialogProps {
	trigger?: React.ReactNode;
	onSuccess?: () => void;
}

export function InterviewSessionForm({
	defaultValues,
	onSuccess,
}: InterviewSessionFormProps) {
	const [focusInput, setFocusInput] = useState("");

	const form = useForm<FormData>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			title: "",
			description: "",
			domain: "",
			careerLevel: CareerLevelEnum.JUNIOR,
			experience: ExperienceLevelEnum.ONE_TO_THREE_YEARS,
			difficulty: QuestionDifficulty.MEDIUM,
			questionTypes: [
				QuestionTypeEnum.MULTIPLE_CHOICE,
				QuestionTypeEnum.TEXT,
			],
			focusAreas: [],
			totalQuestions: 5,
			...defaultValues,
		},
	});

	// For convenience
	const questionTypes = form.watch("questionTypes");
	const focusAreas = form.watch("focusAreas");

	// Add/remove focus area chip
	const addFocusArea = () => {
		const value = focusInput.trim();
		if (value && !focusAreas.includes(value) && focusAreas.length < 5) {
			form.setValue("focusAreas", [...focusAreas, value], {
				shouldDirty: true,
			});
			setFocusInput("");
		}
	};
	const removeFocusArea = (fa: string) => {
		form.setValue(
			"focusAreas",
			focusAreas.filter((f) => f !== fa),
			{ shouldDirty: true }
		);
	};

	// QuestionType toggle chip
	const toggleQuestionType = (type: QuestionTypeEnum) => {
		if (questionTypes.includes(type)) {
			form.setValue(
				"questionTypes",
				questionTypes.filter((t) => t !== type),
				{ shouldDirty: true }
			);
		} else if (questionTypes.length < 5) {
			form.setValue("questionTypes", [...questionTypes, type], {
				shouldDirty: true,
			});
		}
	};

	const onSubmit = async (data: FormData) => {
		try {
			// Transform the data to match your API payload if needed
			const payload: InterviewPromptPayload = {
				...data,
			};
			const response = await ApiService.post(ApiEndpoints.CREATE_INTERVIEW_SESSION, payload);
			console.log(response, "RESPONSE FROM API");
			toast.success("Interview session created.");
			form.reset();
			setFocusInput("");
			onSuccess?.();
		} catch (e: any) {
			toast.error(e?.message ?? "Failed to create session.");
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-6 max-w-2xl mx-auto"
			>
				{/* TITLE */}
				<FormField
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Title{" "}
								<span className="text-destructive">*</span>
							</FormLabel>
							<FormControl>
								<Input
									placeholder="Enter interview title"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Session display title.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* DESCRIPTION */}
				<FormField
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Session description"
									rows={3}
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Optional brief session description.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* DOMAIN */}
				<FormField
					name="domain"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Domain{" "}
								<span className="text-destructive">*</span>
							</FormLabel>
							<FormControl>
								<Input
									placeholder="e.g. Frontend Development"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Applicable job domain/technology.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* CAREER LEVEL */}
				<FormField
					name="careerLevel"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Career Level{" "}
								<span className="text-destructive">*</span>
							</FormLabel>
							<FormControl>
								<Select
									value={field.value}
									onValueChange={field.onChange}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select career level" />
									</SelectTrigger>
									<SelectContent>
										{CareerLevels.map((level) => (
											<SelectItem
												key={level}
												value={level}
											>
												{level.replaceAll("_", " ")}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormControl>
							<FormDescription>
								Target career level for this session.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* EXPERIENCE LEVEL */}
				<FormField
					name="experience"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Experience Level</FormLabel>
							<FormControl>
								<Select
									value={field.value}
									onValueChange={field.onChange}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select experience level" />
									</SelectTrigger>
									<SelectContent>
										{ExperienceLevels.map((exp) => (
											<SelectItem key={exp} value={exp}>
												{exp.replaceAll("_", " ")}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormControl>
							<FormDescription>
								Years of experience expected for candidates.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* DIFFICULTY */}
				<FormField
					name="difficulty"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Difficulty{" "}
								<span className="text-destructive">*</span>
							</FormLabel>
							<FormControl>
								<Select
									value={field.value}
									onValueChange={field.onChange}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select difficulty" />
									</SelectTrigger>
									<SelectContent>
										{Difficulties.map((diff) => (
											<SelectItem key={diff} value={diff}>
												{diff.charAt(0) +
													diff.slice(1).toLowerCase()}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormControl>
							<FormDescription>
								Overall session question difficulty.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* QUESTION TYPES: MULTI-TOGGLE */}
				<FormField
					name="questionTypes"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Question Types{" "}
								<span className="text-destructive">*</span>
							</FormLabel>
							<FormControl>
								<div className="flex flex-wrap gap-2">
									{QuestionTypes.map((type) => (
										<Badge
											key={type}
											variant={
												questionTypes.includes(type)
													? "default"
													: "secondary"
											}
											className="cursor-pointer px-3 py-2"
											onClick={() =>
												toggleQuestionType(type)
											}
										>
											{type.replaceAll("_", " ")}
										</Badge>
									))}
								</div>
							</FormControl>
							<FormDescription>
								Select up to 5 question types. Click to toggle.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* FOCUS AREAS: CHIP ARRAY */}
				<FormField
					name="focusAreas"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Focus Areas</FormLabel>
							<FormControl>
								<div>
									<div className="flex gap-2">
										<Input
											value={focusInput}
											disabled={focusAreas.length >= 5}
											placeholder="e.g. Node.js, System Design"
											onChange={(e) =>
												setFocusInput(e.target.value)
											}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													addFocusArea();
												}
											}}
										/>
										<Button
											type="button"
											onClick={addFocusArea}
											disabled={
												!focusInput.trim() ||
												focusAreas.length >= 5
											}
											variant="secondary"
										>
											Add
										</Button>
									</div>
									{focusAreas.length > 0 && (
										<div className="flex flex-wrap gap-2 mt-2">
											{focusAreas.map((area) => (
												<Badge
													key={area}
													variant="outline"
													className="pr-2"
												>
													{area}
													<Button
														size="icon"
														variant="ghost"
														type="button"
														className="ml-1 text-xs hover:text-destructive h-5 w-5"
														onClick={() =>
															removeFocusArea(
																area
															)
														}
													>
														×
													</Button>
												</Badge>
											))}
										</div>
									)}
								</div>
							</FormControl>
							<FormDescription>
								Add up to 5 interview focus areas.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* TOTAL QUESTIONS */}
				<FormField
					name="totalQuestions"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Total Questions{" "}
								<span className="text-destructive">*</span>
							</FormLabel>
							<FormControl>
								<Input
									type="number"
									min={1}
									max={50}
									placeholder="e.g. 5"
									{...field}
									onChange={(e) =>
										field.onChange(
											parseInt(e.target.value, 10) || 0
										)
									}
								/>
							</FormControl>
							<FormDescription>
								Number of questions in this session (1-50).
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* ACTIONS */}
				<div className="flex justify-end gap-2 pt-4">
					<Button
						type="button"
						variant="outline"
						onClick={() => {
							form.reset();
							setFocusInput("");
						}}
						disabled={form.formState.isSubmitting}
					>
						Reset
					</Button>
					<Button
						type="submit"
						disabled={
							form.formState.isSubmitting ||
							(defaultValues ? !form.formState.isDirty : false)
						}
					>
						{form.formState.isSubmitting ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : defaultValues ? (
							"Update Session"
						) : (
							"Create Session"
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}

export function InterviewSessionDialog({
	trigger,
	onSuccess,
}: InterviewSessionDialogProps) {
	const [open, setOpen] = useState(false);

	const handleSuccess = () => {
		setOpen(false); // Close dialog on success
		onSuccess?.(); // Call parent success handler
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{trigger || (
					<Button>
						<Plus className="w-4 h-4 mr-2" />
						Create Interview Session
					</Button>
				)}
			</DialogTrigger>

			<DialogContent className="p-0">
				<DialogHeader className="px-6 pt-6">
					<DialogTitle>Create Interview Session</DialogTitle>
					<DialogDescription>
						Set up a new interview session with customized questions
						and settings.
					</DialogDescription>
				</DialogHeader>

				<ScrollArea className="max-h-[75vh] px-6 pb-6">
					<InterviewSessionForm onSuccess={handleSuccess} />
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}
