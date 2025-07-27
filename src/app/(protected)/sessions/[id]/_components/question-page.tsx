"use client";

import React, { useState } from "react";
import InterviewComplete from "@/components/atoms/session-overview/session-complete";
import QuestionDisplay from "@/components/molecules/question-container/question-display";
import SessionOverview from "@/components/molecules/session-form-container/session-overview";

type InterviewState = "overview" | "questions" | "complete";

const InterviewPage: React.FC = () => {
	const [currentState, setCurrentState] =
		useState<InterviewState>("complete");

	const handleStartInterview = () => {
		setCurrentState("questions");
	};

	const handleFinishInterview = () => {
		setCurrentState("complete");
	};

	const handleRestartInterview = () => {
		setCurrentState("overview");
	};

	switch (currentState) {
		case "overview":
			return <SessionOverview onStartInterview={handleStartInterview} />;
		case "questions":
			return (
				<QuestionDisplay onFinishInterview={handleFinishInterview} />
			);
		case "complete":
			return <InterviewComplete onRestart={handleRestartInterview} />;
		default:
			return <SessionOverview onStartInterview={handleStartInterview} />;
	}
};

export default InterviewPage;
