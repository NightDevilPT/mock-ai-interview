"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSession } from "@/components/providers/session-form-provider";
import { Loader2, Star, Send, CheckCircle2, AlertTriangle } from "lucide-react";

export const RatingQuestionComponent: React.FC = () => {
	const {
		currentQuestion,
		setQuestionAnswer,
		getQuestionAnswer,
		questionAnswers,
	} = useSession();

	const [rating, setRating] = useState(0);
	const [hoverRating, setHoverRating] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	const maxRating = 5; // You can make this configurable

	// Initialize rating when component mounts or question changes
	useEffect(() => {
		if (currentQuestion) {
			const existingAnswer = getQuestionAnswer(currentQuestion.id);
			if (existingAnswer?.answer) {
				setRating(existingAnswer.answer as number);
			} else {
				setRating(0);
			}
		}
	}, [currentQuestion, getQuestionAnswer]);

	// Handle rating changes
	const handleRatingChange = useCallback(
		(value: number) => {
			setRating(value);
		},
		[currentQuestion, setQuestionAnswer]
	);

	// Handle submission
	const handleSubmitAnswer = useCallback(async () => {
		if (!currentQuestion || rating === 0) {
			setSubmitError("Please select a rating before submitting");
			return;
		}

		setIsSubmitting(true);
		setSubmitError(null);

		try {
			const submissionData = {
				questionId: currentQuestion.id,
				answer: rating,
				timestamp: new Date().toISOString(),
				questionAnswers: questionAnswers,
			};

			setQuestionAnswer(currentQuestion.id, rating);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			setSubmitSuccess(true);
			setTimeout(() => setSubmitSuccess(false), 3000);

			console.log("Rating answer submitted:", submissionData);
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
	}, [currentQuestion, rating, setQuestionAnswer, questionAnswers]);

	const hasRating = rating > 0;

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
					<Star className="h-3 w-3" />
					Rating Scale
				</Badge>

				<Button
					onClick={handleSubmitAnswer}
					disabled={!hasRating || isSubmitting}
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
							Submit Rating
						</>
					)}
				</Button>
			</div>

			{/* Success Message */}
			{submitSuccess && (
				<Alert className="border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
					<CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
					<AlertDescription className="text-green-700 dark:text-green-300 font-medium">
						✅ Rating submitted successfully!
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

			{/* Rating Stars */}
			<Card className="p-8">
				<div className="text-center space-y-6">
					<div className="text-lg font-medium text-foreground">
						Rate from 1 to {maxRating}
					</div>

					<div className="flex justify-center gap-2">
						{[1, 2, 3, 4, 5].map((star) => (
							<button
								key={star}
								onClick={() => handleRatingChange(star)}
								onMouseEnter={() => setHoverRating(star)}
								onMouseLeave={() => setHoverRating(0)}
								className="transition-colors p-1"
							>
								<Star
									className={`h-10 w-10 ${
										star <= (hoverRating || rating)
											? "fill-yellow-400 text-yellow-400"
											: "text-gray-300"
									}`}
								/>
							</button>
						))}
					</div>

					{rating > 0 && (
						<div className="text-sm text-muted-foreground">
							You rated: {rating} out of {maxRating}
						</div>
					)}
				</div>
			</Card>

			{/* Rating Info */}
			<div className="flex items-center justify-between text-sm text-muted-foreground">
				<span>Scale: 1-{maxRating}</span>
				{hasRating && (
					<Badge
						variant="secondary"
						className="flex items-center gap-1"
					>
						<CheckCircle2 className="h-3 w-3" />
						Rating: {rating}★
					</Badge>
				)}
			</div>
		</div>
	);
};
