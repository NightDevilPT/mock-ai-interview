import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
	title: string;
	value: string | number;
	icon: LucideIcon;
	textColors: {
		label: string;
		value: string;
	};
}

const MetricCard: React.FC<MetricCardProps> = ({
	title,
	value,
	icon: Icon,
	textColors,
}) => {
	return (
		<Card
			className={`group transition-all duration-300 border bg-transparent`}
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
						className={`h-10 w-10 rounded-2xl flex items-center justify-center transition-transform`}
					>
						<Icon className="h-full w-full text-white" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default MetricCard;
