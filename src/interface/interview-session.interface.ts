import { z } from "zod";

export enum SessionStatus {
	DRAFT = "DRAFT",
	GENERATED = "GENERATED",
	IN_PROGRESS = "IN_PROGRESS",
	COMPLETED = "COMPLETED",
	EVALUATED = "EVALUATED",
}

// Define enums matching Prisma schema
export enum ExperienceLevelEnum {
	LESS_THAN_1_YEAR = "LESS_THAN_1_YEAR",
	ONE_TO_THREE_YEARS = "ONE_TO_THREE_YEARS",
	THREE_TO_FIVE_YEARS = "THREE_TO_FIVE_YEARS",
	FIVE_TO_TEN_YEARS = "FIVE_TO_TEN_YEARS",
	MORE_THAN_TEN_YEARS = "MORE_THAN_TEN_YEARS",
}

export enum QuestionTypeEnum {
	MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
	CHECKBOX = "CHECKBOX",
	TEXT = "TEXT",
	DROPDOWN = "DROPDOWN",
	RATING = "RATING",
	CODING = "CODING",
}

export enum QuestionDifficulty {
	EASY = "EASY",
	MEDIUM = "MEDIUM",
	HARD = "HARD",
	MIXED = "MIXED",
}

export enum CareerLevelEnum {
	INTERN = "INTERN",
	JUNIOR = "JUNIOR",
	MID = "MID",
	SENIOR = "SENIOR",
	LEAD = "LEAD",
}

export type ContentBlock =
  | ParagraphBlock
  | ListBlock
  | CodeBlock
  | MediaBlock
  | TableBlock;

export interface ParagraphBlock {
  type: 'paragraph';
  data: {
    text: string;
  };
  order: number;
}

export interface ListBlock {
  type: 'list';
  data: {
    items: string[];
    style: 'ordered' | 'unordered';
  };
  order: number;
}

export interface CodeBlock {
  type: 'code';
  data: {
    code: string;
    language: string;
  };
  order: number;
}

export interface MediaBlock {
  type: 'media';
  data: {
    url: string;
    caption: string;
    altText: string;
  };
  order: number;
}

export interface TableBlock {
  type: 'table';
  data: {
    headers: string[];
    rows: {
      cells: string[];
    }[];
  };
  order: number;
}


// Convert enums to arrays for Zod
const experienceLevels = Object.values(ExperienceLevelEnum);
const questionTypes = Object.values(QuestionTypeEnum);
const difficulties = Object.values(QuestionDifficulty);
const careerLevels = Object.values(CareerLevelEnum);

// Enhanced Zod schema with your exact enums
export const InterviewPromptSchema = z
	.object({
		title: z
			.string()
			.min(3, "Title must be at least 3 characters")
			.max(100, "Title cannot exceed 100 characters")
			.trim(),

		description: z
			.string()
			.max(500, "Description cannot exceed 500 characters")
			.optional()
			.default(""),

		careerLevel: z.enum(careerLevels as [string, ...string[]], {
			error: "Invalid Career Level",
		}),
		difficulty: z.enum(difficulties as [string, ...string[]], {
			error: "Invalid Difficulty",
		}),
		experience: z
			.enum(experienceLevels, {
				error: "Invalid experience level",
			})
			.optional()
			.default(ExperienceLevelEnum.ONE_TO_THREE_YEARS),

		domain: z
			.string()
			.min(2, "Domain must be at least 2 characters")
			.max(50, "Domain cannot exceed 50 characters")
			.trim(),
		// INSERT_YOUR_REWRITE_HERE

		questionTypes: z
			.array(
				z.enum(questionTypes, {
					error: "Invalid question type",
				})
			)
			.min(1, "At least one question type is required")
			.max(5, "Maximum 5 question types allowed")
			.default([QuestionTypeEnum.MULTIPLE_CHOICE, QuestionTypeEnum.TEXT]),

		focusAreas: z
			.array(
				z
					.string()
					.min(2, "Focus area must be at least 2 characters")
					.max(30, "Focus area cannot exceed 30 characters")
			)
			.max(5, "Maximum 5 focus areas allowed")
			.optional()
			.default([]),

		totalQuestions: z
			.number()
			.int("Must be an integer")
			.min(1, "Minimum 1 question")
			.max(50, "Maximum 50 questions allowed")
			.default(5),
	})
	.strict();

export type InterviewPromptPayload = z.infer<typeof InterviewPromptSchema>;

// Enhanced validation function
export function validateInterviewPrompt(input: unknown): {
	success: boolean;
	data?: InterviewPromptPayload;
	errors?: z.ZodIssue[];
} {
	const result = InterviewPromptSchema.safeParse(input);
	if (!result.success) {
		return {
			success: false,
			errors: result.error.issues,
		};
	}
	return {
		success: true,
		data: result.data,
	};
}
export interface Question {
	id: string;
	text: string;
	content : ContentBlock[]; // Array of content blocks
	type: QuestionTypeEnum;
	difficulty: QuestionDifficulty;
	points: number;
	order: number;
	category?: string | null;
	estimatedDuration?: number | null;
	options?: string[];
	constraints?: {
		maxLength: number;
		minLength: number;
		timeLimit: number;
	}; // JSON type
	hints?: string[];
	tags?: string[];
	createdAt: string;
	updatedAt: string;
}

export interface Creator {
	id: string;
	email: string;
	avatar: string | null;
	firstName: string;
	lastName: string;
}

export interface Session {
	id: string;
	title: string;
	description?: string | null;
	careerLevel: string;
	experience: string;
	domain: string;
	difficulty: string;
	questionTypes: string[];
	focusAreas: string[];
	isPublic: boolean;
	shareToken?: string | null;
	status: string;
	totalQuestions?: number | null;
	totalPoints?: number | null;
	creatorId: string;
	createdAt: string;
	updatedAt: string;
	creator: Creator;
	questions: Question[];
	_count?: {
		questions: number;
		attempts: number;
	};
}

export interface SessionResponse {
	status: number;
	message: string;
	data: Session | Session[] | null;
	meta: {
		page: number;
		limit: number;
		totalRecords: number;
		totalPages: number;
		isPrevious: boolean;
		isNext: boolean;
		startTime: string;
		endTime: string;
		durationMs: number;
	};
}
// Add these types to your interface file
export type QuestionAnswerType = 
  | string        // For TEXT, CODING, MULTIPLE_CHOICE, DROPDOWN
  | string[]      // For CHECKBOX
  | number;       // For RATING

export interface QuestionAnswer {
    questionId: string;
    answer: QuestionAnswerType;
    isAnswered: boolean;
    answeredAt?: string;
    timeSpent?: number;
}

export interface QuestionAnswerState {
    [questionId: string]: QuestionAnswer;
}

// Form data type based on question type
export type FormDataByQuestionType<T extends QuestionTypeEnum> = 
  T extends QuestionTypeEnum.CHECKBOX ? { questionId: string; answer: string[] } :
  T extends QuestionTypeEnum.RATING ? { questionId: string; answer: number } :
  { questionId: string; answer: string };
