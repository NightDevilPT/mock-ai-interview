import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronLeft, ArrowRight, Flag, AlertTriangle } from "lucide-react";

interface NavigationControlsProps {
	canGoPrevious: boolean;
	canGoNext: boolean;
	isLastQuestion: boolean;
	estimatedTimeRemaining: number;
	answeredCount: number;
	onPrevious: () => void;
	onNext: () => void;
	onFinish: () => void;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
	canGoPrevious,
	canGoNext,
	isLastQuestion,
	estimatedTimeRemaining,
	answeredCount,
	onPrevious,
	onNext,
	onFinish,
}) => {
	return (
		<div className="flex w-full items-center justify-between">
			<Button
				variant="outline"
				onClick={onPrevious}
				disabled={!canGoPrevious}
				className="flex items-center gap-2 px-4 py-2"
			>
				<ChevronLeft className="h-4 w-4" />
				Previous
			</Button>

			{estimatedTimeRemaining <= 60 && estimatedTimeRemaining > 0 && (
				<Alert className="border-amber-300 bg-amber-100 dark:bg-amber-900/20 dark:border-amber-800 mx-4">
					<AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
					<AlertDescription className="text-amber-700 dark:text-amber-300">
						Time running out!
					</AlertDescription>
				</Alert>
			)}

			{isLastQuestion ? (
				<Button
					onClick={onFinish}
					className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white"
					disabled={answeredCount === 0}
				>
					<Flag className="h-4 w-4" />
					Submit Interview
				</Button>
			) : (
				<Button
					onClick={onNext}
					disabled={!canGoNext}
					className="flex items-center gap-2 px-4 py-2"
				>
					Next
					<ArrowRight className="h-4 w-4" />
				</Button>
			)}
		</div>
	);
};
