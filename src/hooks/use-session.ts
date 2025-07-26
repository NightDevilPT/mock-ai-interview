import { QuestionTypeEnum, QuestionDifficulty } from "@/interface/interview-session.interface";

export const useSessionConfig = () => {
    const getDifficultyConfig = (difficulty: string) => {
        switch (difficulty) {
            case QuestionDifficulty.EASY:
                return {
                    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    icon: "🟢",
                    bgGradient: "from-emerald-50 to-emerald-100",
                };
            case QuestionDifficulty.MEDIUM:
                return {
                    color: "bg-amber-50 text-amber-700 border-amber-200",
                    icon: "🟡",
                    bgGradient: "from-amber-50 to-amber-100",
                };
            case QuestionDifficulty.HARD:
                return {
                    color: "bg-rose-50 text-rose-700 border-rose-200",
                    icon: "🔴",
                    bgGradient: "from-rose-50 to-rose-100",
                };
            default:
                return {
                    color: "bg-slate-50 text-muted-foreground border-slate-200",
                    icon: "⚪",
                    bgGradient: "from-slate-50 to-slate-100",
                };
        }
    };

    const getQuestionTypeConfig = (type: string) => {
        const configs = {
            [QuestionTypeEnum.MULTIPLE_CHOICE]: {
                color: "bg-blue-50 text-blue-700 border-blue-200",
                icon: "📝",
                label: "Multiple Choice",
            },
            [QuestionTypeEnum.CODING]: {
                color: "bg-purple-50 text-purple-700 border-purple-200",
                icon: "💻",
                label: "Coding",
            },
            [QuestionTypeEnum.TEXT]: {
                color: "bg-indigo-50 text-indigo-700 border-indigo-200",
                icon: "✍️",
                label: "Text",
            },
            [QuestionTypeEnum.CHECKBOX]: {
                color: "bg-orange-50 text-orange-700 border-orange-200",
                icon: "☑️",
                label: "Checkbox",
            },
            [QuestionTypeEnum.RATING]: {
                color: "bg-pink-50 text-pink-700 border-pink-200",
                icon: "⭐",
                label: "Rating",
            },
            [QuestionTypeEnum.DROPDOWN]: {
                color: "bg-teal-50 text-teal-700 border-teal-200",
                icon: "📋",
                label: "Dropdown",
            },
        };
        return (
            configs[type as QuestionTypeEnum] || {
                color: "bg-gray-50 text-gray-700 border-gray-200",
                icon: "❓",
                label: type.replace(/_/g, " "),
            }
        );
    };

    return { getDifficultyConfig, getQuestionTypeConfig };
};
