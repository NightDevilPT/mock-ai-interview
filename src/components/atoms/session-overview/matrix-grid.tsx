import React from "react";
import MetricCard from "./metrix-card";
import { Session } from "@/interface/interview-session.interface";
import { FileText, Trophy, Timer, TrendingUp } from "lucide-react";

interface MetricsGridProps {
	session: Session;
	estimatedDuration: number;
}

const MetricsGrid: React.FC<MetricsGridProps> = ({
	session,
	estimatedDuration,
}) => {
	const metrics = [
		{
			title: "Total Questions",
			value: session.totalQuestions || session.questions?.length || 0,
			icon: FileText,
			gradient: "bg-gradient-to-br from-blue-50 to-blue-100/50",
			textColors: {
				label: "text-blue-700/80",
				value: "text-blue-900",
			},
		},
		{
			title: "Total Points",
			value: session.totalPoints || 0,
			icon: Trophy,
			gradient: "bg-gradient-to-br from-amber-50 to-amber-100/50",
			textColors: {
				label: "text-amber-700/80",
				value: "text-amber-900",
			},
		},
		{
			title: "Duration",
			value: `${Math.ceil(estimatedDuration / 60)}m`,
			icon: Timer,
			gradient: "bg-gradient-to-br from-emerald-50 to-emerald-100/50",
			textColors: {
				label: "text-emerald-700/80",
				value: "text-emerald-900",
			},
		},
		{
			title: "Attempts",
			value: session._count?.attempts || 0,
			icon: TrendingUp,
			gradient: "bg-gradient-to-br from-purple-50 to-purple-100/50",
			textColors: {
				label: "text-purple-700/80",
				value: "text-purple-900",
			},
		},
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{metrics.map((metric) => (
				<MetricCard
					key={metric.title}
					title={metric.title}
					value={metric.value}
					icon={metric.icon}
					textColors={metric.textColors}
				/>
			))}
		</div>
	);
};

export default MetricsGrid;
