"use client";

import React from "react";
import {
	ContentBlock,
	ParagraphBlock as ParagraphBlockType,
	ListBlock as ListBlockType,
	CodeBlock as CodeBlockType,
	MediaBlock as MediaBlockType,
	TableBlock as TableBlockType,
} from "@/interface/interview-session.interface";

// /atoms/contents
import { ListBlock } from "@/components/atoms/content-types/list-block-content";
import { CodeBlock } from "@/components/atoms/content-types/code-block-content";
import { TableBlock } from "@/components/atoms/content-types/table-block-content";
import { MediaBlock } from "@/components/atoms/content-types/media-block-content";
import { ParagraphBlock } from "@/components/atoms/content-types/paragraph-content";

interface ContentRendererProps {
	content: ContentBlock[];
	className?: string;
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({
	content,
	className = "",
}) => {
	const renderBlock = (block: ContentBlock) => {
		switch (block.type) {
			case "paragraph":
				return (
					<div key={block.order}>
						<ParagraphBlock block={block as ParagraphBlockType} />
					</div>
				);

			case "list":
				return (
					<div key={block.order}>
						<ListBlock block={block as ListBlockType} />
					</div>
				);

			case "code":
				return (
					<div key={block.order}>
						<CodeBlock block={block as CodeBlockType} />
					</div>
				);

			case "media":
				return (
					<div key={block.order}>
						<MediaBlock block={block as MediaBlockType} />
					</div>
				);

			case "table":
				return (
					<div key={block.order}>
						<TableBlock block={block as TableBlockType} />
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div className={`space-y-4 py-4 ${className}`}>
			{content.sort((a, b) => a.order - b.order).map(renderBlock)}
		</div>
	);
};
