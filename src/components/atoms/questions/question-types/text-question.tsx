"use client";

import {
	Loader2,
	FileText,
	Send,
	CheckCircle2,
	AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "@/components/providers/session-form-provider";

export const TextQuestionComponent: React.FC = () => {
	const {
		currentQuestion,
		setQuestionAnswer,
		getQuestionAnswer,
		questionAnswers,
	} = useSession();

	const [textAnswer, setTextAnswer] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	// Initialize text when component mounts or question changes
	useEffect(() => {
		if (currentQuestion) {
			const existingAnswer = getQuestionAnswer(currentQuestion.id);
			if (existingAnswer?.answer) {
				setTextAnswer(existingAnswer.answer as string);
			} else {
				setTextAnswer("");
			}
		}
	}, [currentQuestion, getQuestionAnswer]);

	// Handle text changes
	const handleTextChange = useCallback(
		(value: string) => {
			setTextAnswer(value);
		},
		[currentQuestion, setQuestionAnswer]
	);

	// Handle submission
	const handleSubmitAnswer = useCallback(async () => {
		if (!currentQuestion || !textAnswer.trim()) {
			setSubmitError("Please provide an answer before submitting");
			return;
		}

		// Check constraints
		const minLength = currentQuestion.constraints?.minLength || 0;
		const maxLength = currentQuestion.constraints?.maxLength || 5000;

		if (textAnswer.length < minLength) {
			setSubmitError(
				`Answer must be at least ${minLength} characters long`
			);
			return;
		}

		if (textAnswer.length > maxLength) {
			setSubmitError(`Answer must not exceed ${maxLength} characters`);
			return;
		}

		setIsSubmitting(true);
		setSubmitError(null);

		try {
			const submissionData = {
				questionId: currentQuestion.id,
				answer: textAnswer,
				timestamp: new Date().toISOString(),
				questionAnswers: questionAnswers,
			};

			setQuestionAnswer(currentQuestion.id, textAnswer);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			setSubmitSuccess(true);
			setTimeout(() => setSubmitSuccess(false), 3000);

			console.log("Text answer submitted:", submissionData);
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
	}, [currentQuestion, textAnswer, setQuestionAnswer, questionAnswers]);

	const hasAnswer = textAnswer.trim() !== "";
	const wordCount = textAnswer
		.trim()
		.split(/\s+/)
		.filter((word) => word.length > 0).length;
	const charCount = textAnswer.length;

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
					<FileText className="h-3 w-3" />
					Text Response
				</Badge>

				<Button
					onClick={handleSubmitAnswer}
					disabled={!hasAnswer || isSubmitting}
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

			{/* Text Area */}
			<Card className="p-6">
				<Textarea
					placeholder="Type your answer here..."
					value={textAnswer}
					onChange={(e) => handleTextChange(e.target.value)}
					className="min-h-[300px] resize-none"
					maxLength={currentQuestion.constraints?.maxLength || 5000}
				/>
			</Card>

			{/* Statistics */}
			<div className="flex items-center justify-between text-sm text-muted-foreground">
				<div className="flex items-center gap-4">
					<span>Words: {wordCount}</span>
					<span>Characters: {charCount}</span>
					{currentQuestion.constraints?.maxLength && (
						<span>
							Max: {currentQuestion.constraints.maxLength}
						</span>
					)}
				</div>
				{hasAnswer && (
					<Badge
						variant="secondary"
						className="flex items-center gap-1"
					>
						<CheckCircle2 className="h-3 w-3" />
						Answer Provided
					</Badge>
				)}
			</div>
		</div>
	);
};
