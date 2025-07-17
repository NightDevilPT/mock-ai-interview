import React, { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { I18nProvider } from "./i18n-provider";

const RootProvider = ({ children }: { children: ReactNode }) => {
	return (
		<I18nProvider>
			<ThemeProvider>{children}</ThemeProvider>
		</I18nProvider>
	);
};

export default RootProvider;
