import {
	CheckCircle2,
	Target,
	BookOpen,
	Zap,
	Hash,
	TrendingUp,
	Trophy,
	Timer,
} from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TimerDisplay } from "@/components/atoms/questions/time-display";
import { QuestionTypeEnum } from "@/interface/interview-session.interface";
import { DifficultyBadge } from "@/components/atoms/questions/difficulty-badge";
import { QuestionCounter } from "@/components/atoms/questions/question-counter";

interface QuestionMetadataProps {
	type: QuestionTypeEnum;
	difficulty: string;
	points: number;
	estimatedDuration?: number;
	currentIndex: number;
	totalQuestions: number;
	timeSpent: number;
}

const getQuestionTypeConfig = (type: QuestionTypeEnum) => {
	const configs: Record<
		QuestionTypeEnum,
		{
			label: string;
			icon: React.ReactElement;
			badge: string;
			description: string;
		}
	> = {
		[QuestionTypeEnum.MULTIPLE_CHOICE]: {
			label: "Multiple Choice",
			icon: <CheckCircle2 className="h-3 w-3" />,
			badge: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
			description: "Select one correct answer",
		},
		[QuestionTypeEnum.CHECKBOX]: {
			label: "Multiple Select",
			icon: <Target className="h-3 w-3" />,
			badge: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
			description: "Select all that apply",
		},
		[QuestionTypeEnum.TEXT]: {
			label: "Text Response",
			icon: <BookOpen className="h-3 w-3" />,
			badge: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
			description: "Provide a written answer",
		},
		[QuestionTypeEnum.CODING]: {
			label: "Code Challenge",
			icon: <Zap className="h-3 w-3" />,
			badge: "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
			description: "Write and submit code",
		},
		[QuestionTypeEnum.DROPDOWN]: {
			label: "Dropdown Select",
			icon: <Hash className="h-3 w-3" />,
			badge: "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800",
			description: "Choose from a dropdown list",
		},
		[QuestionTypeEnum.RATING]: {
			label: "Rating Scale",
			icon: <TrendingUp className="h-3 w-3" />,
			badge: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
			description: "Rate on a scale",
		},
	};
	return configs[type];
};

export const QuestionMetadata: React.FC<QuestionMetadataProps> = ({
	type,
	difficulty,
	points,
	estimatedDuration,
	currentIndex,
	totalQuestions,
	timeSpent,
}) => {
	const typeConfig = getQuestionTypeConfig(type);

	return (
		<div className="flex flex-wrap items-center gap-3 mb-6">
			<Badge
				variant="outline"
				className={cn(
					"text-sm font-medium px-3 py-1.5 border",
					typeConfig.badge
				)}
			>
				{typeConfig.icon}
				<span className="ml-2">{typeConfig.label}</span>
			</Badge>

			<DifficultyBadge difficulty={difficulty} />

			<Badge
				variant="outline"
				className="px-3 py-1.5 flex items-center gap-2"
			>
				<Trophy className="h-3 w-3" />
				{points} points
			</Badge>

			{estimatedDuration && (
				<Badge
					variant="outline"
					className="px-3 py-1.5 flex items-center gap-2"
				>
					<Timer className="h-3 w-3" />~{estimatedDuration}min
				</Badge>
			)}

			<QuestionCounter
				currentIndex={currentIndex}
				total={totalQuestions}
			/>

			<TimerDisplay timeSpent={timeSpent} />
		</div>
	);
};
