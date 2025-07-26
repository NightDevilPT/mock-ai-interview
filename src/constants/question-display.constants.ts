// constants/question-display.constants.ts
import { QuestionTypeEnum, QuestionDifficulty } from "@/interface/interview-session.interface";

export const QUESTION_TYPE_CONFIG = {
  [QuestionTypeEnum.MULTIPLE_CHOICE]: {
    label: "Multiple Choice",
    icon: "RadioButton",
    variant: "default" as const,
    className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300",
  },
  [QuestionTypeEnum.CHECKBOX]: {
    label: "Multiple Select",
    icon: "CheckSquare",
    variant: "secondary" as const,
    className: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300",
  },
  [QuestionTypeEnum.TEXT]: {
    label: "Text Response",
    icon: "Type",
    variant: "outline" as const,
    className: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300",
  },
  [QuestionTypeEnum.DROPDOWN]: {
    label: "Single Select",
    icon: "ChevronDown",
    variant: "outline" as const,
    className: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300",
  },
  [QuestionTypeEnum.RATING]: {
    label: "Rating Scale",
    icon: "Star",
    variant: "outline" as const,
    className: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300",
  },
  [QuestionTypeEnum.CODING]: {
    label: "Code Challenge",
    icon: "Code2",
    variant: "outline" as const,
    className: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950 dark:text-slate-300",
  },
} as const;

export const DIFFICULTY_CONFIG = {
  [QuestionDifficulty.EASY]: {
    label: "Easy",
    icon: "Circle",
    variant: "secondary" as const,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300",
  },
  [QuestionDifficulty.MEDIUM]: {
    label: "Medium",
    icon: "CircleDot",
    variant: "outline" as const,
    className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300",
  },
  [QuestionDifficulty.HARD]: {
    label: "Hard",
    icon: "CircleDotDashed",
    variant: "destructive" as const,
    className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300",
  },
  [QuestionDifficulty.MIXED]: {
    label: "Mixed",
    icon: "CircleEllipsis",
    variant: "outline" as const,
    className: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300",
  },
} as const;

export const AUTO_SAVE_DELAY = 2000;
export const TIMER_INTERVAL = 1000;
export const AUTO_SAVE_DURATION = 500;
