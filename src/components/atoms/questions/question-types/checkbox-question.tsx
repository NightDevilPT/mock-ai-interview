"use client";

import {
	Loader2,
	CheckSquare,
	Send,
	CheckCircle2,
	AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "@/components/providers/session-form-provider";
import { ContentRenderer } from "@/components/molecules/content-render-container";

export const CheckboxQuestionComponent: React.FC = () => {
	const {
		currentQuestion,
		setQuestionAnswer,
		getQuestionAnswer,
		questionAnswers,
	} = useSession();

	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	// Initialize selections when component mounts or question changes
	useEffect(() => {
		if (currentQuestion) {
			const existingAnswer = getQuestionAnswer(currentQuestion.id);
			if (
				existingAnswer?.answer &&
				Array.isArray(existingAnswer.answer)
			) {
				setSelectedOptions(existingAnswer.answer as string[]);
			} else {
				setSelectedOptions([]);
			}
		}
	}, [currentQuestion, getQuestionAnswer]);

	// Handle option changes
	const handleOptionChange = useCallback(
		(option: string, checked: boolean) => {
			const newSelections = checked
				? [...selectedOptions, option]
				: selectedOptions.filter((item) => item !== option);

			setSelectedOptions(newSelections);
		},
		[selectedOptions, currentQuestion, setQuestionAnswer]
	);

	// Handle submission
	const handleSubmitAnswer = useCallback(async () => {
		if (!currentQuestion || selectedOptions.length === 0) {
			setSubmitError(
				"Please select at least one option before submitting"
			);
			return;
		}

		setIsSubmitting(true);
		setSubmitError(null);

		try {
			const submissionData = {
				questionId: currentQuestion.id,
				answer: selectedOptions,
				timestamp: new Date().toISOString(),
				questionAnswers: questionAnswers,
			};

			setQuestionAnswer(currentQuestion.id, selectedOptions);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			setSubmitSuccess(true);
			setTimeout(() => setSubmitSuccess(false), 3000);

			console.log("Checkbox answer submitted:", submissionData);
		} catch (error) {
			console.error("Error submitting answer:", error);
			setSubmitError(
				error instanceof Error
					? error.message
					: "Failed to submit answer"
			);
		} finally {
			setIsSubmitting(false);
		}
	}, [currentQuestion, selectedOptions, setQuestionAnswer, questionAnswers]);

	const hasSelections = selectedOptions.length > 0;

	if (!currentQuestion) {
		return (
			<Alert>
				<Loader2 className="h-4 w-4 animate-spin" />
				<AlertDescription>Loading question...</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="space-y-4">
			{/* Header with Submit Button */}
			<div className="flex items-center justify-between">
				<Badge variant="outline" className="flex items-center gap-1">
					<CheckSquare className="h-3 w-3" />
					Multiple Select
				</Badge>

				<Button
					onClick={handleSubmitAnswer}
					disabled={!hasSelections || isSubmitting}
					className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400"
				>
					{isSubmitting ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin" />
							Submitting...
						</>
					) : (
						<>
							<Send className="h-4 w-4" />
							Submit Answers
						</>
					)}
				</Button>
			</div>

			{/* Success Message */}
			{submitSuccess && (
				<Alert className="border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
					<CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
					<AlertDescription className="text-green-700 dark:text-green-300 font-medium">
						✅ Answers submitted successfully!
					</AlertDescription>
				</Alert>
			)}

			{/* Error Message */}
			{submitError && (
				<Alert className="border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
					<AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
					<AlertDescription className="text-red-700 dark:text-red-300 font-medium">
						{submitError}
					</AlertDescription>
				</Alert>
			)}

			{/* Question Content */}
			{currentQuestion.content && (
				<ContentRenderer
					content={currentQuestion.content}
				/>
			)}

			{/* Checkbox Options */}
			<Card className="border-0 p-0 dark:shadow-none">
				<div className="space-y-4">
					{currentQuestion.options?.map((option, index) => (
						<div
							key={index}
							className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
						>
							<Checkbox
								id={`checkbox-${index}`}
								checked={selectedOptions.includes(option)}
								onCheckedChange={(checked) =>
									handleOptionChange(
										option,
										checked as boolean
									)
								}
							/>
							<Label
								htmlFor={`checkbox-${index}`}
								className="flex-1 cursor-pointer font-medium"
							>
								{option}
							</Label>
						</div>
					))}
				</div>
			</Card>

			{/* Selection Info */}
			<div className="flex items-center justify-between text-sm text-muted-foreground">
				<span>
					Selected: {selectedOptions.length} of{" "}
					{currentQuestion.options?.length || 0}
				</span>
				{hasSelections && (
					<Badge
						variant="secondary"
						className="flex items-center gap-1"
					>
						<CheckCircle2 className="h-3 w-3" />
						{selectedOptions.length} Selected
					</Badge>
				)}
			</div>
		</div>
	);
};
