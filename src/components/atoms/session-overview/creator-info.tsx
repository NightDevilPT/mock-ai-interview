import React from "react";
import { User, Calendar, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Creator } from "@/interface/interview-session.interface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CreatorInfoProps {
	creator: Creator;
	createdAt: string;
	updatedAt: string;
}

const CreatorInfo: React.FC<CreatorInfoProps> = ({
	creator,
	createdAt,
	updatedAt,
}) => {
	return (
		<Card className="bg-transparent">
			<CardHeader>
				<CardTitle className="flex items-center text-lg">
					<User className="h-5 w-5 mr-2 text-muted-foreground" />
					Created By
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-start space-x-4">
					<Avatar className="h-16 w-16 border-4 border-white shadow-lg">
						<AvatarImage src={creator.avatar || ""} />
						<AvatarFallback className="bg-primary text-white text-lg font-semibold">
							{creator.firstName[0]}
							{creator.lastName[0]}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1 space-y-2">
						<h4 className="font-semibold text-lg">
							{creator.firstName} {creator.lastName}
						</h4>
						<p className="text-sm text-muted-foreground break-all">
							{creator.email}
						</p>
					</div>
				</div>

				<Separator />

				<div className="space-y-3">
					<div className="flex items-center space-x-3 text-sm text-muted-foreground">
						<Calendar className="h-4 w-4" />
						<span>
							Created:{" "}
							{new Date(createdAt).toLocaleDateString("en-US", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</span>
					</div>
					<div className="flex items-center space-x-3 text-sm text-muted-foreground">
						<Clock className="h-4 w-4" />
						<span>
							Updated:{" "}
							{new Date(updatedAt).toLocaleDateString("en-US", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default CreatorInfo;
