import React from "react";
import { Clock } from "lucide-react";

interface TimerDisplayProps {
	timeSpent: number;
	className?: string;
}

const formatTime = (seconds: number) => {
	const hours = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;
	if (hours > 0) {
		return `${hours}:${mins.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`;
	}
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
	timeSpent,
	className,
}) => {
	return (
		<div
			className={`flex items-center gap-2 bg-muted rounded-full px-3 py-1 ${className}`}
		>
			<Clock className="h-4 w-4 text-muted-foreground" />
			<span className="text-sm font-mono font-medium text-foreground">
				{formatTime(timeSpent)}
			</span>
		</div>
	);
};
