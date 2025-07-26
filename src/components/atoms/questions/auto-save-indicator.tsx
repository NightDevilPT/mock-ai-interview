import React from "react";
import { Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AutoSaveIndicatorProps {
	isVisible: boolean;
}

export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({
	isVisible,
}) => {
	if (!isVisible) return null;

	return (
		<Badge
			variant="secondary"
			className="flex items-center gap-1 animate-pulse bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400"
		>
			<Save className="h-3 w-3" />
			Auto-saved
		</Badge>
	);
};
