"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2 } from "lucide-react";

interface CopyButtonProps {
	text: string;
	className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
	text,
	className = "h-7 w-7 p-0 hover:bg-muted",
}) => {
	const [copied, setCopied] = useState(false);

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy code:", err);
		}
	};

	return (
		<Button
			size="sm"
			variant="ghost"
			onClick={copyToClipboard}
			className={className}
			title={copied ? "Copied!" : "Copy to clipboard"}
		>
			{copied ? (
				<CheckCircle2 className="h-3 w-3 text-green-600" />
			) : (
				<Copy className="h-3 w-3" />
			)}
		</Button>
	);
};
