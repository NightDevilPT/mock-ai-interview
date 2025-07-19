"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
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
					<item.icon className="h-4 w-4" />
					<span>{item.title}</span>
				</Link>
			</SidebarMenuButton>
			{item.items?.map((subItem, i) => (
				<SidebarMenuItem key={i} className="ml-8">
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
	return (
		<>
			<SidebarMenu className={group.className}>
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
		<Sidebar collapsible="offcanvas" className={className} {...props}>
			<SidebarHeader className="w-full h-auto">{logo}</SidebarHeader>
			<Separator className="mt-2" />

			<SidebarContent className="pt-4 pb-3 px-1">
				{navGroups.map((group, index) => (
					<SidebarNavGroup key={index} group={group} />
				))}
			</SidebarContent>

			<Separator className="mb-2" />

			{user && (
				<SidebarFooter className="p-1">
					<NavUser user={user} position="right" />
				</SidebarFooter>
			)}
		</Sidebar>
	);
}
