"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import * as React from "react";
import { LucideIcon } from "lucide-react";
import { MockAiLogoFull } from "../logo-container";
import { Separator } from "@/components/ui/separator";
import { NavUser } from "@/components/atoms/user-nav";

// Type definitions
type NavItem = {
	title: string;
	url: string;
	icon: LucideIcon;
	items?: NavItem[];
};

type NavGroup = {
	groupName?: string;
	items: NavItem[];
	className?: string;
	showSeparator?: boolean;
};

type SidebarNavProps = {
	navGroups?: NavGroup[];
	user?: {
		name: string;
		email: string;
		avatar: string;
	};
	logo?: React.ReactNode;
	className?: string;
} & React.ComponentProps<typeof Sidebar>;

// Navigation Item Component
const SidebarNavItem = ({ item }: { item: NavItem }) => {
	return (
		<SidebarMenuItem>
			<SidebarMenuButton asChild>
				<Link href={item.url} className="flex items-center gap-3">
					<item.icon className="h-5 w-5" />
					<span>{item.title}</span>
				</Link>
			</SidebarMenuButton>
			{item.items?.map((subItem, i) => (
				<SidebarMenuItem key={i} className="">
					<SidebarMenuButton asChild>
						<Link href={subItem.url}>{subItem.title}</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			))}
		</SidebarMenuItem>
	);
};

// Navigation Group Component
const SidebarNavGroup = ({ group }: { group: NavGroup }) => {
	const sidebar = useSidebar();
	return (
		<>
			<SidebarMenu className={`justify-center ${sidebar.state==="collapsed" && "items-center" } ${group.className}`}>
				{group.groupName && (
					<div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
						{group.groupName}
					</div>
				)}
				{group.items.map((item, index) => (
					<SidebarNavItem key={index} item={item} />
				))}
			</SidebarMenu>
			{group.showSeparator && <Separator />}
		</>
	);
};

// Main Sidebar Component
export function AppSidebar({
	navGroups = [],
	user,
	logo = <MockAiLogoFull iconSize={35} />,
	className,
	...props
}: SidebarNavProps) {
	return (
		<Sidebar collapsible="icon" className={className} {...props}>
			<SidebarHeader className="w-full h-auto">{logo}</SidebarHeader>

			<SidebarContent className="pt-4 pb-3 justify-center items-center">
				{navGroups.map((group, index) => (
					<SidebarNavGroup key={index} group={group} />
				))}
			</SidebarContent>

			<Separator className="mb-2" />

			{user && (
				<SidebarFooter className="">
					<NavUser user={user} position="right" />
				</SidebarFooter>
			)}
		</Sidebar>
	);
}
