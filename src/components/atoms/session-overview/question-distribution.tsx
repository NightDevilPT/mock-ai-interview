import React from "react";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Session } from "@/interface/interview-session.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuestionDistributionProps {
	session: Session;
	questionsByDifficulty: Record<string, number>;
	getDifficultyConfig: (difficulty: string) => {
		color: string;
		icon: string;
		bgGradient: string;
	};
}

const QuestionDistribution: React.FC<QuestionDistributionProps> = ({
	session,
	questionsByDifficulty,
	getDifficultyConfig,
}) => {
	return (
		<Card className="gap-0">
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center text-xl">
					<BookOpen className="h-6 w-6 mr-3 text-muted-foreground" />
					Question Distribution
				</CardTitle>
			</CardHeader>
			<Separator />
			<CardContent className="mt-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{Object.entries(questionsByDifficulty).map(
						([difficulty, count]) => {
							const config = getDifficultyConfig(difficulty);
							const percentage =
								(count / (session.questions?.length || 1)) *
								100;

							return (
								<div
									key={difficulty}
									className="text-center space-y-4"
								>
									<div
										className={`p-6 rounded-2xl bg-gradient-to-br ${config.bgGradient} border-white/50`}
									>
										<div className="text-3xl font-bold text-slate-800 mb-2">
											{count}
										</div>
										<Badge
											className={`${config.color} border`}
										>
											{config.icon} {difficulty}
										</Badge>
									</div>
									<div className="space-y-2">
										<div className="flex justify-between text-sm text-muted-foreground">
											<span>Distribution</span>
											<span>
												{percentage.toFixed(0)}%
											</span>
										</div>
										<Progress
											value={percentage}
											className="h-2"
										/>
									</div>
								</div>
							);
						}
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default QuestionDistribution;
