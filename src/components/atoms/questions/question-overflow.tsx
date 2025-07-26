import React from "react";
import { BarChart3 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SessionOverviewProps {
	answeredCount: number;
	totalQuestions: number;
	sessionTime: string;
	currentQuestionTime: string;
	timeLeft?: string;
}

export const QuestionOverview: React.FC<SessionOverviewProps> = ({
	answeredCount,
	totalQuestions,
	sessionTime,
	currentQuestionTime,
	timeLeft,
}) => {
	return (
		<Card className="shadow-lg gap-0 p-0">
			<CardHeader className="px-4">
				<CardTitle className="text-lg flex items-center gap-2 pt-3 pb-2">
					<BarChart3 className="h-5 w-5" />
					Session Overview
				</CardTitle>
			</CardHeader>
			<Separator className="mb-4" />
			<CardContent className="space-y-4 pb-4">
				<div className="grid grid-cols-2 gap-3 text-sm">
					<div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
						<div className="font-bold text-xl text-green-600 dark:text-green-400">
							{answeredCount}
						</div>
						<div className="text-muted-foreground">Answered</div>
					</div>
					<div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
						<div className="font-bold text-xl text-amber-600 dark:text-amber-400">
							{totalQuestions - answeredCount}
						</div>
						<div className="text-muted-foreground">Remaining</div>
					</div>
				</div>
				<div className="space-y-2 text-sm">
					<div className="flex justify-between">
						<span className="text-muted-foreground">
							Session Time:
						</span>
						<span className="font-semibold text-foreground">
							{sessionTime}
						</span>
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">
							Current Question:
						</span>
						<span className="font-semibold text-foreground">
							{currentQuestionTime}
						</span>
					</div>
					{timeLeft && (
						<div className="flex justify-between">
							<span className="text-muted-foreground">
								Time Left:
							</span>
							<span className="font-semibold text-amber-600 dark:text-amber-400">
								{timeLeft}
							</span>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};
