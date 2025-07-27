"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { TableBlock as TableBlockType } from "@/interface/interview-session.interface";

interface TableBlockProps {
	block: TableBlockType;
}

export const TableBlock: React.FC<TableBlockProps> = ({ block }) => {
	return (
		<Card className="overflow-hidden border p-0 border-muted">
			<CardContent className="p-0">
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-muted bg-secondary">
							{block.data.headers.map((header, idx) => (
								<TableHead
									key={idx}
									className="font-semibold text-foreground border-r border-muted last:border-r-0"
								>
									{header}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{block.data.rows.map((row, rowIdx) => (
							<TableRow
								key={rowIdx}
								className="hover:bg-muted/30 transition-colors duration-200"
							>
								{row.cells.map((cell, cellIdx) => (
									<TableCell
										key={cellIdx}
										className="border-r border-muted last:border-r-0 font-medium text-foreground"
									>
										{cell}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
};
