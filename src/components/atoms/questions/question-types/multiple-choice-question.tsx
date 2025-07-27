"use client";

import {
	Loader2,
	CircleDot,
	Send,
	CheckCircle2,
	AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "@/components/providers/session-form-provider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const MultipleChoiceQuestionComponent: React.FC = () => {
	const {
		currentQuestion,
		setQuestionAnswer,
		getQuestionAnswer,
		questionAnswers,
	} = useSession();

	const [selectedOption, setSelectedOption] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	// Initialize selection when component mounts or question changes
	useEffect(() => {
		if (currentQuestion) {
			const existingAnswer = getQuestionAnswer(currentQuestion.id);
			if (existingAnswer?.answer) {
				setSelectedOption(existingAnswer.answer as string);
			} else {
				setSelectedOption("");
			}
		}
	}, [currentQuestion, getQuestionAnswer]);

	// Handle option changes
	const handleOptionChange = useCallback(
		(value: string) => {
			setSelectedOption(value);
		},
		[currentQuestion, setQuestionAnswer]
	);

	// Handle submission
	const handleSubmitAnswer = useCallback(async () => {
		if (!currentQuestion || !selectedOption) {
			setSubmitError("Please select an option before submitting");
			return;
		}

		setIsSubmitting(true);
		setSubmitError(null);

		try {
			const submissionData = {
				questionId: currentQuestion.id,
				answer: selectedOption,
				timestamp: new Date().toISOString(),
				questionAnswers: questionAnswers,
			};

			setQuestionAnswer(currentQuestion.id, selectedOption);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			setSubmitSuccess(true);
			setTimeout(() => setSubmitSuccess(false), 3000);

			console.log("Multiple choice answer submitted:", submissionData);
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
	}, [currentQuestion, selectedOption, setQuestionAnswer, questionAnswers]);

	const hasSelection = selectedOption !== "";

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
					<CircleDot className="h-3 w-3" />
					Multiple Choice
				</Badge>

				<Button
					onClick={handleSubmitAnswer}
					disabled={!hasSelection || isSubmitting}
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
							Submit Answer
						</>
					)}
				</Button>
			</div>

			{/* Success Message */}
			{submitSuccess && (
				<Alert className="border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
					<CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
					<AlertDescription className="text-green-700 dark:text-green-300 font-medium">
						✅ Answer submitted successfully!
					</AlertDescription>
				</Alert>
			)}

			{/* Error Message */}
			{submitError && (
				<Alert className="border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
					<AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
					<AlertDescription className="text-red-700 dark:text-red-300 font-medium">
						❌ {submitError}
					</AlertDescription>
				</Alert>
			)}

			{/* Options */}
			<Card className="p-6">
				<RadioGroup
					value={selectedOption}
					onValueChange={handleOptionChange}
				>
					<div className="space-y-4">
						{currentQuestion.options?.map((option, index) => (
							<div
								key={index}
								className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
							>
								<RadioGroupItem
									value={option}
									id={`option-${index}`}
								/>
								<Label
									htmlFor={`option-${index}`}
									className="flex-1 cursor-pointer font-medium"
								>
									{option}
								</Label>
							</div>
						))}
					</div>
				</RadioGroup>
			</Card>

			{/* Selection Info */}
			<div className="flex items-center justify-between text-sm text-muted-foreground">
				<span>
					Total Options: {currentQuestion.options?.length || 0}
				</span>
				{hasSelection && (
					<Badge
						variant="secondary"
						className="flex items-center gap-1"
					>
						<CheckCircle2 className="h-3 w-3" />
						Option Selected
					</Badge>
				)}
			</div>
		</div>
	);
};
