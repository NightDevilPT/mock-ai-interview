import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface DifficultyBadgeProps {
	difficulty: string;
	className?: string;
}

const getDifficultyConfig = (difficulty: string) => {
	const configs: Record<
		string,
		{
			badge: string;
			icon: React.ReactElement;
			description: string;
		}
	> = {
		easy: {
			badge: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
			icon: <div className="w-2 h-2 rounded-full bg-green-500"></div>,
			description: "Fundamental concepts",
		},
		medium: {
			badge: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
			icon: <div className="w-2 h-2 rounded-full bg-yellow-500"></div>,
			description: "Intermediate knowledge",
		},
		hard: {
			badge: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
			icon: <div className="w-2 h-2 rounded-full bg-red-500"></div>,
			description: "Advanced expertise",
		},
	};
	return configs[difficulty.toLowerCase()] || configs.easy;
};

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
	difficulty,
	className,
}) => {
	const config = getDifficultyConfig(difficulty);

	return (
		<Badge
			variant="outline"
			className={cn(
				"text-sm font-medium px-3 py-1.5 border",
				config.badge,
				className
			)}
		>
			{config.icon}
			<span className="ml-2 capitalize">{difficulty}</span>
		</Badge>
	);
};
