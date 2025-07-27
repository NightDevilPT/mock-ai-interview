import {
	QuestionTypeEnum,
	QuestionAnswerType,
} from "@/interface/interview-session.interface";
import React from "react";
import { HelpCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import all question components
import { TextQuestionComponent } from "@/components/atoms/questions/question-types/text-question";
import { RatingQuestionComponent } from "@/components/atoms/questions/question-types/rating-question";
import { CodingQuestionComponent } from "@/components/atoms/questions/question-types/coding-question";
import { CheckboxQuestionComponent } from "@/components/atoms/questions/question-types/checkbox-question";
import { DropdownQuestionComponent } from "@/components/atoms/questions/question-types/dropdown-question";
import { MultipleChoiceQuestionComponent } from "@/components/atoms/questions/question-types/multiple-choice-question";

interface QuestionInputProps {
	type: QuestionTypeEnum;
	value?: QuestionAnswerType;
	onChange: (value: QuestionAnswerType) => void;
}

export const QuestionInput: React.FC<QuestionInputProps> = ({
	type,
	value,
	onChange,
}) => {
	const renderInput = () => {
		switch (type) {
			case QuestionTypeEnum.MULTIPLE_CHOICE:
				return <MultipleChoiceQuestionComponent />;

			case QuestionTypeEnum.CHECKBOX:
				return <CheckboxQuestionComponent />;

			case QuestionTypeEnum.TEXT:
				return <TextQuestionComponent />;

			case QuestionTypeEnum.CODING:
				return <CodingQuestionComponent />;

			case QuestionTypeEnum.DROPDOWN:
				return <DropdownQuestionComponent />;

			case QuestionTypeEnum.RATING:
				return <RatingQuestionComponent />;

			default:
				return (
					<Alert className="border-amber-300 bg-amber-100 dark:bg-amber-900/20 dark:border-amber-800">
						<HelpCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
						<AlertDescription className="text-amber-700 dark:text-amber-300">
							Unsupported question type: {type}
						</AlertDescription>
					</Alert>
				);
		}
	};

	return (
		<div className="rounded-lg min-h-[400px]">
			{renderInput()}
		</div>
	);
};
