// src/i18n.js (or src/i18n/index.js)
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translations
import enTranslations from "../locale/en/index.json";

i18n.use(initReactI18next).init({
	resources: {
		en: {
			translation: enTranslations,
		},
	},
	lng: "en",
	fallbackLng: "en",
	interpolation: {
		escapeValue: false,
	},
	react: {
		useSuspense: false, // If you're not using Suspense
	},
});

export default i18n;
