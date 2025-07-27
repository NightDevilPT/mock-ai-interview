import {
	Brain,
	Target,
	Award,
	Star,
	Layers,
	BookOpen,
	Play,
	ArrowRight,
} from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Session } from "@/interface/interview-session.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SessionConfigurationProps {
	session: Session;
	difficultyConfig: {
		color: string;
		icon: string;
		bgGradient: string;
	};
	getQuestionTypeConfig: (type: string) => {
		color: string;
		icon: string;
		label: string;
	};
	onStartInterview: () => void;
}

// Individual config item card component
const ConfigItemCard: React.FC<{
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	value?: string;
	badge?: React.ReactNode;
}> = ({ icon: Icon, label, value, badge }) => (
	<Card>
		<CardContent>
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-3">
					<div className="rounded-lg">
						<Icon className="h-4 w-4 text-muted-foreground" />
					</div>
					<span className="font-medium text-muted-foreground">
						{label}
					</span>
				</div>
				{badge || (
					<Badge variant="outline" className="font-medium">
						{value}
					</Badge>
				)}
			</div>
		</CardContent>
	</Card>
);

// Question types section as a separate card
const QuestionTypesCard: React.FC<{
	questionTypes: string[];
	getQuestionTypeConfig: (type: string) => {
		color: string;
		icon: string;
		label: string;
	};
}> = ({ questionTypes, getQuestionTypeConfig }) => (
	<Card className="dark:bg-secondary gap-0">
		<CardHeader className="pb-2">
			<CardTitle className="flex items-center text-lg font-semibold">
				<div className="rounded-lg mr-3">
					<BookOpen className="h-5 w-5" />
				</div>
				Question Types
			</CardTitle>
		</CardHeader>
		<CardContent>
			<div className="flex flex-wrap gap-3">
				{questionTypes.map((type) => {
					const config = getQuestionTypeConfig(type);
					return (
						<Badge
							key={type}
							className={`${config.color} px-4 py-2 border font-medium`}
						>
							<span className="mr-2">{config.icon}</span>
							{config.label}
						</Badge>
					);
				})}
			</div>
		</CardContent>
	</Card>
);

// Focus areas section as a separate card
const FocusAreasCard: React.FC<{
	focusAreas: string[];
}> = ({ focusAreas }) => (
	<Card className="dark:bg-secondary gap-0">
		<CardHeader className="pb-3">
			<CardTitle className="flex items-center text-lg font-semibold">
				<div className="p-2 bg-emerald-100 rounded-lg mr-3">
					<Target className="h-4 w-4 text-emerald-600" />
				</div>
				Focus Areas
			</CardTitle>
		</CardHeader>
		<CardContent>
			<div className="flex flex-wrap gap-2">
				{focusAreas.map((area) => (
					<Badge
						key={area}
						variant="outline"
						className="px-3 py-1 transition-colors font-medium"
					>
						{area}
					</Badge>
				))}
			</div>
		</CardContent>
	</Card>
);

const SessionConfiguration: React.FC<SessionConfigurationProps> = ({
	session,
	difficultyConfig,
	getQuestionTypeConfig,
	onStartInterview,
}) => {
	const configItems = [
		{
			icon: Target,
			label: "Domain",
			value: session.domain,
		},
		{
			icon: Award,
			label: "Career Level",
			value: session.careerLevel,
		},
		{
			icon: Star,
			label: "Experience",
			value: session.experience.replace(/_/g, " ").toLowerCase(),
		},
		{
			icon: Layers,
			label: "Difficulty",
			value: session.difficulty,
			badge: (
				<Badge
					className={`${difficultyConfig.color} border font-medium`}
				>
					<span className="mr-1">{difficultyConfig.icon}</span>
					{session.difficulty}
				</Badge>
			),
		},
	];

	return (
		<Card className="border dark:border-0 overflow-hidden gap-2">
			<CardHeader>
				<CardTitle className="flex items-center text-xl pb-2 font-bold justify-between">
					<div className="rounded-lg mr-3 flex justify-center items-center gap-4">
						<Brain className="h-5 w-5" />
						Session Configuration
					</div>
					<Button
						size="lg"
						variant="outline"
						onClick={onStartInterview}
						className="px-12 py-4 text-lg font-semibold"
					>
						<Play className="h-6 w-6 mr-3 group-hover:translate-x-1 transition-transform" />
						Start Interview
						<ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
					</Button>
				</CardTitle>
			</CardHeader>
			<Separator />

			<CardContent className="p-6 space-y-6">
				{/* Basic Configuration Items */}
				<div className="space-y-4">
					<h3 className="text-sm font-semibold uppercase tracking-wide">
						Session Details
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{configItems.map((item) => (
							<ConfigItemCard
								key={item.label}
								icon={item.icon}
								label={item.label}
								value={item.value}
								badge={item.badge}
							/>
						))}
					</div>
				</div>

				<Separator className="my-8" />

				{/* Question Types Section */}
				<div className="space-y-4">
					<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
						Assessment Structure
					</h3>
					<QuestionTypesCard
						questionTypes={session.questionTypes}
						getQuestionTypeConfig={getQuestionTypeConfig}
					/>
				</div>

				{/* Focus Areas Section */}
				{session.focusAreas && session.focusAreas.length > 0 && (
					<>
						<Separator className="my-6" />
						<div className="space-y-4">
							<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
								Specialized Topics
							</h3>
							<FocusAreasCard focusAreas={session.focusAreas} />
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
};

export default SessionConfiguration;
