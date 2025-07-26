"use client";

import React, { useState } from "react";
import { useSession } from "@/components/providers/session-form-provider";
import SessionOverview from "@/components/molecules/session-form-container/session-overview";
import InterviewComplete from "@/components/atoms/session-overview/session-complete";
import QuestionDisplay from "@/components/molecules/question-container/question-display";

type InterviewState = "overview" | "questions" | "complete";

const InterviewPage: React.FC = () => {
	const [currentState, setCurrentState] =
		useState<InterviewState>("overview");

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
