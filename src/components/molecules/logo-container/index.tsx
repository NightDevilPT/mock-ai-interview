import React from "react";
import MockAiLogoIcon from "@/components/atoms/mock-ai-logo";
import { useTranslation } from "react-i18next";
import { useSidebar } from "@/components/ui/sidebar";

const MockAiLogoFull = ({
	iconSize = 32,
	className = "",
}: {
	iconSize?: number;
	className?: string;
}) => {
	const sidebar = useSidebar();
	const { t } = useTranslation();
	return (
		<div className={`flex items-center gap-3 ${className}`}>
			<MockAiLogoIcon size={iconSize} />
			{sidebar.state === "expanded" && (
				<div className="flex flex-col">
					<span className="text-base font-bold tracking-tight text-foreground">
						{t("general.mockAiInterview")}
					</span>
					<span className="text-xs font-medium text-muted-foreground -mt-1">
						{t("general.aiPoweredInterview")}
					</span>
				</div>
			)}
		</div>
	);
};

export { MockAiLogoFull };
