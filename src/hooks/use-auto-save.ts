// hooks/use-auto-save.ts
import {
	AUTO_SAVE_DELAY,
	AUTO_SAVE_DURATION,
} from "@/constants/question-display.constants";
import { useState, useEffect, useCallback } from "react";

export const useAutoSave = (
	currentQuestionId: string | undefined,
	currentAnswer: any
) => {
	const [isAutoSaving, setIsAutoSaving] = useState(false);

	const triggerAutoSave = useCallback(() => {
		if (!currentQuestionId) return;

		setIsAutoSaving(true);

		// Simulate auto-save API call
		setTimeout(() => {
			setIsAutoSaving(false);
		}, AUTO_SAVE_DURATION);
	}, [currentQuestionId]);

	useEffect(() => {
		if (!currentQuestionId || !currentAnswer) return;

		const autoSaveTimer = setTimeout(triggerAutoSave, AUTO_SAVE_DELAY);
		return () => clearTimeout(autoSaveTimer);
	}, [currentQuestionId, currentAnswer, triggerAutoSave]);

	return { isAutoSaving };
};
