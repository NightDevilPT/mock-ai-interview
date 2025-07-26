"use client";

import { HelpCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";
import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useSession } from "@/components/providers/session-form-provider";

// Import molecules

import { QuestionInput } from "./question-input";
import { SessionInfo } from "../../atoms/questions/session-info";
import { QuestionHeader } from "../../atoms/questions/question-header";
import { PointsDetails } from "../../atoms/questions/question-point-details";
import { QuestionOverview } from "../../atoms/questions/question-overflow";
import { QuestionAnswerType } from "@/interface/interview-session.interface";
import { NavigationControls } from "../../atoms/questions/navigation-controller";
import { AutoSaveIndicator } from "@/components/atoms/questions/auto-save-indicator";

interface QuestionDisplayProps {
	onFinishInterview: () => void;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
	onFinishInterview,
}) => {
	const {
		currentQuestion,
		currentQuestionIndex,
		questions,
		setQuestionAnswer,
		getQuestionAnswer,
		isQuestionAnswered,
		goToNextQuestion,
		goToPreviousQuestion,
		canGoNext,
		canGoPrevious,
		progressPercentage,
		answeredCount,
		totalQuestions,
	} = useSession();

	const [timeSpent, setTimeSpent] = useState(0);
	const [isAutoSaving, setIsAutoSaving] = useState(false);
	const [sessionStartTime] = useState(Date.now());

	// Enhanced timer with session tracking
	useEffect(() => {
		const timer = setInterval(() => {
			setTimeSpent((prev) => prev + 1);
		}, 1000);
		return () => clearInterval(timer);
	}, [currentQuestion]);

	useEffect(() => {
		setTimeSpent(0);
	}, [currentQuestionIndex]);

	// Enhanced auto-save with debouncing
	useEffect(() => {
		const autoSaveTimer = setTimeout(() => {
			if (currentQuestion) {
				setIsAutoSaving(true);
				setTimeout(() => setIsAutoSaving(false), 800);
			}
		}, 1500);
		return () => clearTimeout(autoSaveTimer);
	}, [currentQuestion, getQuestionAnswer(currentQuestion?.id || "")]);

	const handleAnswerChange = useCallback(
		(answer: QuestionAnswerType) => {
			if (currentQuestion) {
				setQuestionAnswer(currentQuestion?.id, answer);
			}
		},
		[currentQuestion?.id, setQuestionAnswer]
	);

	const formatTime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const mins = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		if (hours > 0) {
			return `${hours}:${mins.toString().padStart(2, "0")}:${secs
				.toString()
				.padStart(2, "0")}`;
		}
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const getTotalSessionTime = () => {
		return Math.floor((Date.now() - sessionStartTime) / 1000);
	};

	if (!currentQuestion || !questions) {
		return (
			<div className="container mx-auto p-6 max-w-7xl">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="lg:col-span-2">
						<Card className="shadow-lg">
							<CardContent className="p-8">
								<div className="space-y-4">
									<Skeleton className="h-4 w-1/3" />
									<Skeleton className="h-2 w-full" />
								</div>
							</CardContent>
						</Card>
					</div>
					<div className="lg:col-span-1">
						<Card className="shadow-lg">
							<CardContent className="p-8">
								<div className="text-center">
									<HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-50" />
									<h3 className="text-xl font-semibold text-foreground mb-2">
										No Questions Available
									</h3>
									<p className="text-muted-foreground">
										Please check your connection or contact
										support
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		);
	}

	const currentAnswer = getQuestionAnswer(currentQuestion.id);
	const isLastQuestion = currentQuestionIndex === questions.length - 1;
	const estimatedTimeRemaining = Math.max(
		0,
		(currentQuestion.estimatedDuration || 5) * 60 - timeSpent
	);

	return (
		<TooltipProvider>
			<div className="container mx-auto p-6 max-w-7xl bg-background relative">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full relative">
					{/* Left Column - Question Content */}
					<div className="lg:col-span-2 space-y-6 h-full">
						<Card className="shadow-xl overflow-hidden gap-0 relative">
							{/* Auto-save indicator */}
							<div className="absolute top-4 right-4 z-10">
								<AutoSaveIndicator isVisible={isAutoSaving} />
							</div>

							<QuestionHeader
								question={{
									...currentQuestion,
									estimatedDuration:
										currentQuestion.estimatedDuration ??
										undefined,
								}}
								currentIndex={currentQuestionIndex}
								totalQuestions={totalQuestions}
								timeSpent={timeSpent}
							/>

							<CardContent className="pt-0 pb-8">
								<QuestionInput
									type={currentQuestion.type}
									value={currentAnswer?.answer}
									onChange={handleAnswerChange}
								/>
							</CardContent>

							<CardFooter>
								<NavigationControls
									canGoPrevious={canGoPrevious}
									canGoNext={canGoNext}
									isLastQuestion={isLastQuestion}
									estimatedTimeRemaining={
										estimatedTimeRemaining
									}
									answeredCount={answeredCount}
									onPrevious={goToPreviousQuestion}
									onNext={goToNextQuestion}
									onFinish={onFinishInterview}
								/>
							</CardFooter>
						</Card>
					</div>

					{/* Right Column - Sticky Sidebar */}
					<div className="lg:col-span-1 sticky top-6 self-start space-y-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
						<QuestionOverview
							answeredCount={answeredCount}
							totalQuestions={totalQuestions}
							sessionTime={formatTime(getTotalSessionTime())}
							currentQuestionTime={formatTime(timeSpent)}
							timeLeft={
								estimatedTimeRemaining > 0
									? formatTime(estimatedTimeRemaining)
									: undefined
							}
						/>

						<PointsDetails
							currentPoints={currentQuestion.points}
							totalPoints={questions.reduce(
								(sum, q) => sum + q.points,
								0
							)}
							category={currentQuestion.category ?? undefined}
							questionId={currentQuestion.id}
						/>

						<SessionInfo
							sessionId={`INT-${sessionStartTime}`}
							startTime={new Date(
								sessionStartTime
							).toLocaleTimeString()}
						/>
					</div>
				</div>
			</div>
		</TooltipProvider>
	);
};

export default QuestionDisplay;
