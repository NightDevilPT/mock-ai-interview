"use client";

import React from "react";
import { useSessionConfig } from "@/hooks/use-session";
import MetricsGrid from "../../atoms/session-overview/matrix-grid";
import CreatorInfo from "../../atoms/session-overview/creator-info";
import SessionHero from "../../atoms/session-overview/session-hero";
import ReadyStatus from "../../atoms/session-overview/ready-status";
import { useSession } from "@/components/providers/session-form-provider";
import SessionNotFound from "../../atoms/session-overview/session-not-found";
import QuestionDistribution from "../../atoms/session-overview/question-distribution";
import SessionConfiguration from "../../atoms/session-overview/session-configuration";
import SessionOverviewSkeleton from "../../atoms/session-overview/session-overview-skeleton";

interface SessionOverviewProps {
	onStartInterview: () => void;
}

const SessionOverview: React.FC<SessionOverviewProps> = ({
	onStartInterview,
}) => {
	const { session, isLoading } = useSession();
	const { getDifficultyConfig, getQuestionTypeConfig } = useSessionConfig();

	if (isLoading) {
		return <SessionOverviewSkeleton />;
	}

	if (!session) {
		return <SessionNotFound />;
	}

	const difficultyConfig = getDifficultyConfig(session.difficulty);
	const estimatedDuration =
		session.questions?.reduce(
			(total, q) => total + (q.estimatedDuration || 120),
			0
		) || 0;

	const questionsByDifficulty =
		session.questions?.reduce((acc, q) => {
			acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
			return acc;
		}, {} as Record<string, number>) || {};

	return (
		<div className="min-h-screen">
			<div className="mx-auto space-y-5">
				<SessionHero
					session={session}
					difficultyConfig={difficultyConfig}
				/>

				<MetricsGrid
					session={session}
					estimatedDuration={estimatedDuration}
				/>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2 space-y-6">
						<SessionConfiguration
							session={session}
							difficultyConfig={difficultyConfig}
							getQuestionTypeConfig={getQuestionTypeConfig}
							onStartInterview={onStartInterview}
						/>

						<QuestionDistribution
							session={session}
							questionsByDifficulty={questionsByDifficulty}
							getDifficultyConfig={getDifficultyConfig}
						/>
					</div>

					<div className="space-y-6">
						<CreatorInfo
							creator={session.creator}
							createdAt={session.createdAt}
							updatedAt={session.updatedAt}
						/>
						<ReadyStatus />
					</div>
				</div>
			</div>
		</div>
	);
};

export default SessionOverview;
