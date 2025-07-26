import React from "react";
import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { QuestionTypeEnum } from "@/interface/interview-session.interface";
import { QuestionMetadata } from "../../molecules/question-container/question-metadata";

interface Question {
	id: string;
	text: string;
	type: QuestionTypeEnum;
	difficulty: string;
	points: number;
	estimatedDuration?: number;
	tags?: string[];
}

interface QuestionHeaderProps {
	question: Question;
	currentIndex: number;
	totalQuestions: number;
	timeSpent: number;
}

export const QuestionHeader: React.FC<QuestionHeaderProps> = ({
	question,
	currentIndex,
	totalQuestions,
	timeSpent,
}) => {
	return (
		<CardHeader className="pb-4">
			<QuestionMetadata
				type={question.type}
				difficulty={question.difficulty}
				points={question.points}
				estimatedDuration={question.estimatedDuration}
				currentIndex={currentIndex}
				totalQuestions={totalQuestions}
				timeSpent={timeSpent}
			/>

			<CardTitle className="text-2xl leading-relaxed font-semibold text-foreground mb-4">
				{question.text}
			</CardTitle>

			{question.tags && question.tags.length > 0 && (
				<div className="flex flex-wrap items-center gap-2">
					<Tag className="h-4 w-4 text-muted-foreground" />
					{question.tags.map((tag, index) => (
						<Badge
							key={index}
							variant="outline"
							className="px-2 py-1"
						>
							{tag}
						</Badge>
					))}
				</div>
			)}
		</CardHeader>
	);
};
