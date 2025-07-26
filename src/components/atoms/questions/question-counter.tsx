import React from "react";
import { Badge } from "@/components/ui/badge";

interface QuestionCounterProps {
	currentIndex: number;
	total: number;
	className?: string;
}

export const QuestionCounter: React.FC<QuestionCounterProps> = ({
	currentIndex,
	total,
	className,
}) => {
	return (
		<Badge variant="outline" className={`px-3 py-1.5 ${className}`}>
			Question {currentIndex + 1} of {total}
		</Badge>
	);
};
