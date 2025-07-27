"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code } from "lucide-react";
import Editor from "@monaco-editor/react";
import { CodeBlock as CodeBlockType } from "@/interface/interview-session.interface";
import { CopyButton } from "../copy-button";

interface CodeBlockProps {
	block: CodeBlockType;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ block }) => {
	return (
		<Card className="overflow-hidden border border-muted p-0">
			<div className="flex items-center justify-between border-b border-muted px-5 py-2">
				<div className="flex items-center gap-2">
					<Code className="h-4 w-4 text-muted-foreground" />
					<Badge variant="secondary" className="text-xs font-mono">
						{block.data.language.toUpperCase()}
					</Badge>
				</div>
				<CopyButton text={block.data.code} />
			</div>
			<div className="">
				<div style={{ height: "200px" }} className="border-0">
					<Editor
						height="100%"
						language={block.data.language}
						value={block.data.code}
						theme={
							window.matchMedia("(color-scheme: dark)").matches
								? "vs-dark"
								: "vs"
						}
						options={{
							readOnly: true,
							minimap: { enabled: false },
							scrollBeyondLastLine: false,
							automaticLayout: true,
							fontSize: 13,
							lineHeight: 18,
							scrollbar: {
								vertical: "auto",
								horizontal: "auto",
								useShadows: false,
							},
							folding: false,
							lineNumbers: "on",
							glyphMargin: false,
							contextmenu: false,
							wordWrap: "on",
						}}
						loading={
							<div className="flex items-center justify-center h-full">
								<div className="text-xs text-muted-foreground">
									Loading code...
								</div>
							</div>
						}
					/>
				</div>
			</div>
		</Card>
	);
};
