import React, { ReactNode } from "react";
import I18nProvider from "./i18n-provider";

const RootProvider = ({ children }: { children: ReactNode }) => {
	return <I18nProvider>{children}</I18nProvider>;
};

export default RootProvider;
