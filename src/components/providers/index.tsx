"use client";

import React, { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { I18nProvider } from "./i18n-provider";
import SidebarContainer from "../molecules/sidebar-container";
import { usePathname } from "next/navigation";

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
		<SidebarContainer>
			<I18nProvider>
				<ThemeProvider>{children}</ThemeProvider>
			</I18nProvider>
		</SidebarContainer>
	);
};

export default RootProvider;
