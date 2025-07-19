import { IconType } from "react-icons";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";

interface MetricCardProps {
	title: string;
	value: string | number;
	description?: string;
	trend: {
		value: string;
		direction: "up" | "down";
		description?: string;
	};
	footerText?: string;
	className?: string;
}

export function MetricCard({
	title,
	value,
	description,
	trend,
	footerText,
	className = "",
}: MetricCardProps) {
	const TrendIcon = trend.direction === "up" ? TrendingUp : TrendingDown;
	const trendColor =
		trend.direction === "up" ? "text-green-500" : "text-red-500";

	return (
		<Card className={`@container/card ${className}`}>
			<CardHeader>
				<CardDescription>{title}</CardDescription>
				<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
					{value}
				</CardTitle>
				{description && (
					<p className="text-sm text-muted-foreground">
						{description}
					</p>
				)}
				<CardAction>
					<Badge variant="outline" className={trendColor}>
						<TrendIcon className="size-4" />
						{trend.value}
					</Badge>
				</CardAction>
			</CardHeader>
			<CardFooter className="flex-col items-start gap-1.5 text-sm">
				<div className="line-clamp-1 flex gap-2 font-medium">
					{trend.description} <TrendIcon className="size-4" />
				</div>
				{footerText && (
					<div className="text-muted-foreground">{footerText}</div>
				)}
			</CardFooter>
		</Card>
	);
}
