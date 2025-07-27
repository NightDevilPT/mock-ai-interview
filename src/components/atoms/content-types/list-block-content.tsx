"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ListBlock as ListBlockType } from "@/interface/interview-session.interface";

interface ListBlockProps {
	block: ListBlockType;
}

export const ListBlock: React.FC<ListBlockProps> = ({ block }) => {
	return (
		<Card className="border-0 gap-0 shadow-none overflow-hidden">
			<CardContent className="p-0">
				{block.data.style === "ordered" ? (
					<ol className="list-decimal list-inside p-0 space-y-2 text-foreground">
						{block.data.items.map((item, idx) => (
							<li
								key={idx}
								className="leading-relaxed text-sm font-medium"
							>
								{item}
							</li>
						))}
					</ol>
				) : (
					<ul className="list-disc list-inside space-y-2 text-foreground">
						{block.data.items.map((item, idx) => (
							<li
								key={idx}
								className="leading-relaxed text-sm font-medium"
							>
								{item}
							</li>
						))}
					</ul>
				)}
			</CardContent>
		</Card>
	);
};
