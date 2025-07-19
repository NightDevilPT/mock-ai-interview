import React from "react";
import { AppSidebar } from "./app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DatabaseIcon, LayoutDashboardIcon, SettingsIcon } from "lucide-react";
import { SiteHeader } from "@/components/molecules/sidebar-container/site-header";
import { useTranslation } from "react-i18next";

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
			className="w-full h-screen"
		>
			<AppSidebar
				variant="inset"
				navGroups={[
					{
						items: [
							{
								title: t("general.dashboard"),
								url: "/dashboard",
								icon: LayoutDashboardIcon,
							},
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
			<SidebarInset>
				<SiteHeader />
				<div className="w-full h-full p-5">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default SidebarContainer;
