// src/app/page.js (or your component file)
"use client"; // Only needed if using Next.js App Router

import { useTranslation } from "react-i18next";


export default function Home() {
	const { t, ready } = useTranslation();

	if (!ready) {
		return <div>Loading translations...</div>;
	}

	return <div>{t("general.welcome")}</div>;
}
