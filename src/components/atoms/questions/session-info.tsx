import React from "react";
import { Eye, Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

interface SessionInfoProps {
	sessionId: string;
	startTime: string;
}

export const SessionInfo: React.FC<SessionInfoProps> = ({
	sessionId,
	startTime,
}) => {
	return (
		<Card className="shadow-lg p-0 gap-0">
			<CardContent className="p-4 space-y-2 text-xs text-muted-foreground">
				<div className="flex items-center gap-2">
					<Eye className="h-3 w-3" />
					<span>Session: {sessionId}</span>
				</div>
				<div className="flex items-center gap-2">
					<Calendar className="h-3 w-3" />
					<span>Started: {startTime}</span>
				</div>
				<Separator className="mt-5" />
				<div className="text-center pt-2">
					Need help? Press F1 for assistance
				</div>
			</CardContent>
		</Card>
	);
};
