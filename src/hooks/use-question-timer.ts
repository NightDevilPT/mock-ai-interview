// hooks/use-question-timer.ts
import { useState, useEffect, useCallback } from "react";

export const useQuestionTimer = (currentQuestionId: string | undefined) => {
	const [timeSpent, setTimeSpent] = useState(0);

	const resetTimer = useCallback(() => {
		setTimeSpent(0);
	}, []);

	useEffect(() => {
		if (!currentQuestionId) return;

		const timer = setInterval(() => {
			setTimeSpent((prev) => prev + 1);
		}, 1000);

		return () => clearInterval(timer);
	}, [currentQuestionId]);

	useEffect(() => {
		resetTimer();
	}, [currentQuestionId, resetTimer]);

	const formatTime = useCallback((seconds: number): string => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
	}, []);

	return {
		timeSpent,
		formattedTime: formatTime(timeSpent),
		resetTimer,
	};
};
