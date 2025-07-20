"use client";

import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "../../atoms/theme-toggle";
import { NavUser } from "@/components/atoms/user-nav";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LanguageSwitcher } from "../../atoms/language-switcher";

export function SiteHeader() {
	const { t } = useTranslation();
	const pathname = usePathname();

	// Generate breadcrumb items from pathname
	const generateBreadcrumbs = () => {
		const paths = pathname.split("/").filter(Boolean);
		const breadcrumbs = [];

		if (paths.length === 0) {
			breadcrumbs.push({
				href: "/",
				label: t(`general.dashboard`),
			});
		}

		// Generate remaining breadcrumbs
		let currentPath = "";
		for (const path of paths) {
			currentPath += `/${path}`;
			breadcrumbs.push({
				href: currentPath,
				label:
					path.charAt(0).toUpperCase() +
					path.slice(1).replace(/-/g, " "),
			});
		}

		return breadcrumbs;
	};

	const breadcrumbs = generateBreadcrumbs();

	return (
		<header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
			<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1" />

				{/* Breadcrumb Navigation using shadcn components */}
				<Breadcrumb className="hidden sm:flex">
					<BreadcrumbList>
						{breadcrumbs.map((crumb, index) => (
							<BreadcrumbItem key={index}>
								{index > 0 && <BreadcrumbSeparator />}
								{index === breadcrumbs.length - 1 ? (
									<BreadcrumbPage>
										{crumb.label}
									</BreadcrumbPage>
								) : (
									<BreadcrumbLink asChild>
										<Link href={crumb.href}>
											{crumb.label}
										</Link>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						))}
					</BreadcrumbList>
				</Breadcrumb>

				<div className="ml-auto flex items-center gap-2">
					<ThemeToggle />
					<LanguageSwitcher variant="ghost" showText={false} />
					<NavUser
						user={{
							name: "John Doe",
							email: "johndoe@example.com",
							avatar: "https://via.placeholder.com/150",
						}}
						variant="icon"
					/>
				</div>
			</div>
		</header>
	);
}
