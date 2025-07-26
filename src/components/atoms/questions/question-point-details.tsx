import React from "react";
import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PointsDetailsProps {
	currentPoints: number;
	totalPoints: number;
	category?: string;
	questionId: string;
}

export const PointsDetails: React.FC<PointsDetailsProps> = ({
	currentPoints,
	totalPoints,
	category,
	questionId,
}) => {
	return (
		<Card className="shadow-lg gap-0 p-0">
			<CardHeader className="px-4">
				<CardTitle className="text-lg flex items-center gap-2 pt-3 pb-2">
					<Trophy className="h-5 w-5" />
					Points & Details
				</CardTitle>
			</CardHeader>
			<Separator className="mb-4" />
			<CardContent className="space-y-3 text-sm pb-4">
				<div className="flex justify-between">
					<span className="text-muted-foreground">
						Current Points:
					</span>
					<span className="font-bold text-primary text-lg">
						{currentPoints}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-muted-foreground">Total Points:</span>
					<span className="font-semibold text-foreground">
						{totalPoints}
					</span>
				</div>
				{category && (
					<div className="flex justify-between">
						<span className="text-muted-foreground">Category:</span>
						<Badge variant="secondary" className="text-xs">
							{category}
						</Badge>
					</div>
				)}
				<div className="flex justify-between">
					<span className="text-muted-foreground">Question ID:</span>
					<span className="font-mono text-xs text-muted-foreground">
						{questionId.slice(-8)}
					</span>
				</div>
			</CardContent>
		</Card>
	);
};
