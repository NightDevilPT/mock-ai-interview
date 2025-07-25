import {
	Aperture,
	LayoutDashboardIcon,
	NotebookPen,
	SettingsIcon,
	SquaresIntersect,
} from "lucide-react";
import React from "react";
import { AppSidebar } from "./app-sidebar";
import { useTranslation } from "react-i18next";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/molecules/sidebar-container/site-header";

const SidebarContainer = ({ children }: { children: React.ReactNode }) => {
	const { t } = useTranslation();
	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 72)",
					"--header-height": "calc(var(--spacing) * 15)",
				} as React.CSSProperties
			}
			className="w-full h-screen overflow-hidden"
		>
			<AppSidebar
				variant="inset"
				navGroups={[
					{
						items: [
							{
								title: t("general.dashboard"),
								url: "/",
								icon: LayoutDashboardIcon,
							},
							// {
							// 	title: t("general.attempedInterview"),
							// 	url: "/attempted-interview",
							// 	icon: SquaresIntersect,
							// },
							{
								title: t("general.sessions", "Sessions") || 'Sessions',
								url: "/sessions",
								icon: NotebookPen,
							},
							// {
							// 	title: t("general.resources"),
							// 	url: "/resources",
							// 	icon: Aperture
							// }
						],
					},
					{
						className: "mt-auto",
						items: [
							{
								title: t("general.setting"),
								url: "/settings",
								icon: SettingsIcon,
							},
						],
					},
				]}
				user={{
					name: "John Doe",
					email: "johndoe@example.com",
					avatar: "https://via.placeholder.com/150",
				}}
			/>
			<SidebarInset className="w-full overflow-hidden">
				<SiteHeader />
				<ScrollArea className="w-full p-5 overflow-hidden">{children}</ScrollArea>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default SidebarContainer;
