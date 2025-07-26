"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Trophy, RotateCcw } from "lucide-react";
import { useSession } from "@/components/providers/session-form-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InterviewCompleteProps {
	onRestart: () => void;
}

const InterviewComplete: React.FC<InterviewCompleteProps> = ({ onRestart }) => {
	const { session, answeredCount, totalQuestions, questionAnswers } =
		useSession();

	if (!session) return null;

	const completionPercentage = Math.round(
		(answeredCount / totalQuestions) * 100
	);

	// Calculate estimated score (you can make this more sophisticated)
	const totalPossiblePoints = session.totalPoints || 0;
	const estimatedScore = Math.round(
		(answeredCount / totalQuestions) * totalPossiblePoints * 0.8
	); // Rough estimation

	return (
		<div className="max-w-2xl mx-auto p-6 space-y-6">
			{/* Success Header */}
			<div className="text-center space-y-4">
				<div className="flex justify-center">
					<CheckCircle className="h-16 w-16 text-green-600" />
				</div>
				<h1 className="text-3xl font-bold text-gray-900">
					Interview Complete!
				</h1>
				<p className="text-lg text-gray-600">
					Thank you for completing the interview session.
				</p>
			</div>

			{/* Results Summary */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center">
						<Trophy className="h-5 w-5 mr-2" />
						Your Results
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Stats Grid */}
					<div className="grid grid-cols-2 gap-4">
						<div className="text-center p-4 bg-blue-50 rounded-lg">
							<p className="text-2xl font-bold text-blue-600">
								{answeredCount}
							</p>
							<p className="text-sm text-blue-600">
								Questions Answered
							</p>
						</div>
						<div className="text-center p-4 bg-green-50 rounded-lg">
							<p className="text-2xl font-bold text-green-600">
								{completionPercentage}%
							</p>
							<p className="text-sm text-green-600">
								Completion Rate
							</p>
						</div>
						<div className="text-center p-4 bg-purple-50 rounded-lg">
							<p className="text-2xl font-bold text-purple-600">
								{estimatedScore}
							</p>
							<p className="text-sm text-purple-600">
								Estimated Score
							</p>
						</div>
						<div className="text-center p-4 bg-orange-50 rounded-lg">
							<p className="text-2xl font-bold text-orange-600">
								{totalPossiblePoints}
							</p>
							<p className="text-sm text-orange-600">
								Total Points
							</p>
						</div>
					</div>

					{/* Session Info */}
					<div className="space-y-2">
						<h3 className="font-semibold text-gray-900">
							Session: {session.title}
						</h3>
						<div className="flex flex-wrap gap-2">
							<Badge variant="outline">{session.domain}</Badge>
							<Badge variant="outline">
								{session.difficulty}
							</Badge>
							<Badge variant="outline">
								{session.careerLevel}
							</Badge>
						</div>
					</div>

					{/* Next Steps */}
					<div className="bg-gray-50 rounded-lg p-4">
						<h4 className="font-medium text-gray-900 mb-2">
							What's Next?
						</h4>
						<ul className="text-sm text-gray-600 space-y-1">
							<li>• Your responses have been saved</li>
							<li>• You can review your answers anytime</li>
							<li>• Consider trying more challenging sessions</li>
							<li>
								• Check out similar interviews in the{" "}
								{session.domain} domain
							</li>
						</ul>
					</div>
				</CardContent>
			</Card>

			{/* Action Buttons */}
			<div className="flex flex-col sm:flex-row gap-4 justify-center">
				<Button variant="outline" onClick={onRestart}>
					<RotateCcw className="h-4 w-4 mr-2" />
					Review Session
				</Button>
				<Button>Find Similar Interviews</Button>
			</div>
		</div>
	);
};

export default InterviewComplete;
