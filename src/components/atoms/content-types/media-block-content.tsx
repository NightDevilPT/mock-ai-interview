"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Image } from "lucide-react";
import { MediaBlock as MediaBlockType } from "@/interface/interview-session.interface";

interface MediaBlockProps {
	block: MediaBlockType;
}

export const MediaBlock: React.FC<MediaBlockProps> = ({ block }) => {
	const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
		const target = e.target as HTMLImageElement;
		target.src = "/file.svg";
		target.style.width = "200px";
		target.style.height = "200px";
	};

	return (
		<Card className="overflow-hidden border-0 shadow-none">
			<div className="relative flex items-center justify-center">
				<img
					src={block.data.url}
					alt={block.data.altText}
					className="w-full max-w-full max-h-[300px] object-contain transition-transform duration-300"
					loading="lazy"
					onError={handleImageError}
				/>
				<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
					<Badge
						variant="secondary"
						className="text-foreground"
					>
						<Image className="h-3 w-3 mr-1" />
						Image
					</Badge>
				</div>
			</div>
		</Card>
	);
};
