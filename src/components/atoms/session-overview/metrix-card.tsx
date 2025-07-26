import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
	title: string;
	value: string | number;
	icon: LucideIcon;
	gradient: string;
	textColors: {
		label: string;
		value: string;
		bg: string;
	};
}

const MetricCard: React.FC<MetricCardProps> = ({
	title,
	value,
	icon: Icon,
	gradient,
	textColors,
}) => {
	return (
		<Card
			className={`group hover:shadow-lg transition-all duration-300 border-0 shadow-md`}
		>
			<CardContent>
				<div className="flex items-center justify-between">
					<div className="space-y-2">
						<p
							className={`text-sm font-medium`}
						>
							{title}
						</p>
						<p className={`text-3xl font-bold `}>
							{value}
						</p>
					</div>
					<div
						className={`h-12 w-12 ${textColors.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}
					>
						<Icon className="h-6 w-6 text-white" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default MetricCard;
