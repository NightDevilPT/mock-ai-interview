import {
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

export function DashboardCard({
	title,
	value,
	description,
	trend,
	trendValue,
	footerText,
	footerDescription,
}: {
	title: string;
	value: string;
	description: string;
	trend: "up" | "down";
	trendValue: string;
	footerText: string;
	footerDescription: string;
}) {
	const TrendIcon = trend === "up" ? IconTrendingUp : IconTrendingDown;

	return (
		<Card className="@container/card">
			<CardHeader>
				<CardDescription>{title}</CardDescription>
				<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
					{value}
				</CardTitle>
				<CardAction>
					<Badge variant="outline">
						<TrendIcon />
						{trendValue}
					</Badge>
				</CardAction>
			</CardHeader>
			<CardFooter className="flex-col items-start gap-1.5 text-sm">
				<div className="line-clamp-1 flex gap-2 font-medium">
					{footerText} <TrendIcon className="size-4" />
				</div>
				<div className="text-muted-foreground">{footerDescription}</div>
			</CardFooter>
		</Card>
	);
}
