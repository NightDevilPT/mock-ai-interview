"use client";

import {
	IconDotsVertical,
	IconLogout,
	IconUserCircle,
} from "@tabler/icons-react";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type NavUserProps = {
	user: {
		name: string;
		email: string;
		avatar: string;
	};
	variant?: "full" | "icon";
	menuItems?: Array<{
		label: string;
		icon: React.ReactNode;
		onClick?: () => void;
		separatorBefore?: boolean;
	}>;
	className?: string;
	position?: "bottom" | "right" | "left" | "top";
};

export function NavUser({
	user,
	variant = "full",
	menuItems = [
		{
			label: "Profile",
			icon: <IconUserCircle />,
			separatorBefore: false,
		},
		{
			label: "Log out",
			icon: <IconLogout />,
			separatorBefore: true,
		},
	],
	className = "",
	position = "bottom",
}: NavUserProps) {
	const { isMobile } = useSidebar();

	const getAvatarFallback = () => {
		const nameParts = user.name.split(" ");
		return `${nameParts[0]?.charAt(0) ?? ""}${
			nameParts[1]?.charAt(0) ?? ""
		}`.toUpperCase();
	};

	return (
		<SidebarMenu className={className}>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						{variant === "full" ? (
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<Avatar className="h-8 w-8 rounded-lg grayscale">
									<AvatarImage
										src={user.avatar}
										alt={user.name}
									/>
									<AvatarFallback className="rounded-lg">
										{getAvatarFallback()}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">
										{user.name}
									</span>
									<span className="text-muted-foreground truncate text-xs">
										{user.email}
									</span>
								</div>
								<IconDotsVertical className="ml-auto size-4" />
							</SidebarMenuButton>
						) : (
							<Avatar className="h-8 w-8 rounded-lg grayscale cursor-pointer">
								<AvatarImage
									src={user.avatar}
									alt={user.name}
								/>
								<AvatarFallback className="rounded-lg">
									{getAvatarFallback()}
								</AvatarFallback>
							</Avatar>
						)}
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={
							position ? position : isMobile ? "bottom" : "right"
						}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage
										src={user.avatar}
										alt={user.name}
									/>
									<AvatarFallback className="rounded-lg">
										{getAvatarFallback()}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">
										{user.name}
									</span>
									<span className="text-muted-foreground truncate text-xs">
										{user.email}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							{menuItems.map((item, index) => (
								<React.Fragment key={index}>
									{item.separatorBefore && (
										<DropdownMenuSeparator />
									)}
									<DropdownMenuItem onClick={item.onClick}>
										{item.icon}
										{item.label}
									</DropdownMenuItem>
								</React.Fragment>
							))}
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
