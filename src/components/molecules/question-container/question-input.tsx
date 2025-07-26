import {
	QuestionTypeEnum,
	QuestionAnswerType,
} from "@/interface/interview-session.interface";
import React from "react";
import { HelpCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
				return (
					<div className="space-y-4">
						<div className="text-sm font-medium text-foreground mb-4">
							Select the best answer:
						</div>
						<div className="text-center text-muted-foreground py-12">
							Multiple choice component implementation here
						</div>
					</div>
				);
			case QuestionTypeEnum.CHECKBOX:
				return (
					<div className="space-y-4">
						<div className="text-sm font-medium text-foreground mb-4">
							Select all that apply:
						</div>
						<div className="text-center text-muted-foreground py-12">
							Checkbox component implementation here
						</div>
					</div>
				);
			case QuestionTypeEnum.TEXT:
				return (
					<div className="space-y-4">
						<div className="text-sm font-medium text-foreground mb-4">
							Provide your answer below:
						</div>
						<div className="text-center text-muted-foreground py-12">
							Text input component implementation here
						</div>
					</div>
				);
			case QuestionTypeEnum.CODING:
				return (
					<div className="space-y-4">
						<div className="text-sm font-medium text-foreground mb-4">
							Write your code solution:
						</div>
						<div className="text-center text-muted-foreground py-12">
							Code editor component implementation here
						</div>
					</div>
				);
			case QuestionTypeEnum.DROPDOWN:
				return (
					<div className="space-y-4">
						<div className="text-sm font-medium text-foreground mb-4">
							Select from dropdown:
						</div>
						<div className="text-center text-muted-foreground py-12">
							Dropdown component implementation here
						</div>
					</div>
				);
			case QuestionTypeEnum.RATING:
				return (
					<div className="space-y-4">
						<div className="text-sm font-medium text-foreground mb-4">
							Rate on a scale:
						</div>
						<div className="text-center text-muted-foreground py-12">
							Rating component implementation here
						</div>
					</div>
				);
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
		<div className="bg-muted/50 rounded-lg p-6 min-h-[400px]">
			{renderInput()}
		</div>
	);
};
