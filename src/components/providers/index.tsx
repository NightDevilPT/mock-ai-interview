"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { I18nProvider } from "./i18n-provider";
import { ThemeProvider } from "./theme-provider";
import SidebarContainer from "../molecules/sidebar-container";

const RootProvider = ({ children }: { children: ReactNode }) => {
	const pathName = usePathname();
	const validSidebar = [
		"/auth/login",
		"/auth/signup",
		"/auth/update",
		"/auth/verify",
	];
	const isAuthPath = validSidebar.includes(pathName);
	return isAuthPath ? (
		<I18nProvider>
			<ThemeProvider>{children}</ThemeProvider>
		</I18nProvider>
	) : (
		<I18nProvider>
			<ThemeProvider>
				<SidebarContainer>{children}</SidebarContainer>{" "}
			</ThemeProvider>
		</I18nProvider>
	);
};

export default RootProvider;
