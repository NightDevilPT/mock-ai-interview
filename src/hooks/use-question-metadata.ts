// hooks/use-question-metadata.ts
import {
	QUESTION_TYPE_CONFIG,
	DIFFICULTY_CONFIG,
} from "@/constants/question-display.constants";
import { useMemo } from "react";
import { QuestionMetadata } from "@/interface/question-dispay";
import { Question } from "@/interface/interview-session.interface";

export const useQuestionMetadata = (
	question: Question | null
): QuestionMetadata | null => {
	return useMemo(() => {
		if (!question) return null;

		const typeConfig = QUESTION_TYPE_CONFIG[question.type];
		const difficultyConfig = DIFFICULTY_CONFIG[question.difficulty];

		return {
			type: typeConfig,
			difficulty: difficultyConfig,
		};
	}, [question]);
};
