"use client";

import React from "react";
import { ParagraphBlock as ParagraphBlockType } from "@/interface/interview-session.interface";

interface ParagraphBlockProps {
	block: ParagraphBlockType;
}

export const ParagraphBlock: React.FC<ParagraphBlockProps> = ({ block }) => {
	return (
		<div
			className="prose prose-sm dark:prose-invert max-w-none text-foreground"
			dangerouslySetInnerHTML={{
				__html: block.data.text,
			}}
		/>
	);
};
