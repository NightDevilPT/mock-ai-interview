import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ReadyStatus: React.FC = () => {
	const statusItems = [
		"Questions Loaded",
		"Timer Ready",
		"Auto-save Enabled",
	];

	return (
		<Card className="border gap-0 bg-transparent">
			<CardHeader className="pb-2">
				<CardTitle className="p-0 flex items-center">
					<CheckCircle2 className="h-5 w-5 mr-2" />
					Ready to Start
				</CardTitle>
			</CardHeader>
			<Separator className="my-2" />
			<CardContent>
				{statusItems.map((item) => (
					<div
						key={item}
						className="flex items-center justify-between py-2"
					>
						<span>{item}</span>
						<CheckCircle2 className="h-5 w-5 text-emerald-400" />
					</div>
				))}
			</CardContent>
		</Card>
	);
};

export default ReadyStatus;
