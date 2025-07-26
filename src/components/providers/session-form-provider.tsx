"use client";

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
	useCallback,
} from "react";
import {
	Question,
	Session,
	SessionResponse,
	QuestionAnswer,
	QuestionAnswerState,
} from "@/interface/interview-session.interface";
import ApiService from "@/services/api.service";
import { ApiEndpoints } from "@/interface/api-response.interface";

// Context state interface
interface SessionContextState {
	session: Session | null;
	isLoading: boolean;
	error: string | null;
	refetchSession: () => Promise<void>;
	questions: Question[] | undefined;
	currentQuestion: Question | null;
	setCurrentQuestion: React.Dispatch<React.SetStateAction<Question | null>>;
	currentQuestionIndex: number;

	// Form state management
	questionAnswers: QuestionAnswerState;
	setQuestionAnswer: (questionId: string, answer: any) => void;
	getQuestionAnswer: (questionId: string) => QuestionAnswer | null;
	clearQuestionAnswer: (questionId: string) => void;
	isQuestionAnswered: (questionId: string) => boolean;

	// Navigation
	goToNextQuestion: () => void;
	goToPreviousQuestion: () => void;
	goToQuestion: (index: number) => void;
	canGoNext: boolean;
	canGoPrevious: boolean;

	// Progress tracking
	answeredCount: number;
	totalQuestions: number;
	progressPercentage: number;
}

// Create context
const SessionContext = createContext<SessionContextState | undefined>(
	undefined
);

// Custom hook to use session context
export const useSession = (): SessionContextState => {
	const context = useContext(SessionContext);
	if (context === undefined) {
		throw new Error("useSession must be used within a SessionProvider");
	}
	return context;
};

// Provider props
interface SessionProviderProps {
	children: ReactNode;
	sessionId: string;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({
	children,
	sessionId,
}) => {
	const [questions, setQuestions] = useState<Question[]>();
	const [session, setSession] = useState<Session | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [currentQuestion, setCurrentQuestion] = useState<Question | null>(
		null
	);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

	// Form state
	const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswerState>(
		{}
	);

	// Fetch session data
	const fetchSession = async () => {
		if (!sessionId) {
			setError("Session ID is required");
			setIsLoading(false);
			return;
		}

		try {
			setIsLoading(true);
			setError(null);

			const response = await ApiService.get<SessionResponse>(
				ApiEndpoints.GET_SESSION_BY_ID + sessionId
			);
			if (response.data) {
				const sessionData = response?.data as unknown as Session;
				setSession(sessionData);
			} else {
				throw new Error(response.message || "No session data received");
			}
		} catch (err) {
			console.error("Error fetching session:", err);
			setError(
				err instanceof Error ? err.message : "Unknown error occurred"
			);
			setSession(null);
		} finally {
			setIsLoading(false);
		}
	};

	// Initial fetch on mount and when sessionId changes
	useEffect(() => {
		fetchSession();
	}, [sessionId]);

	useEffect(() => {
		if (session?.questions) {
			const allQuestions = session.questions?.sort(
				(a, b) => a?.order - b?.order
			);
			setQuestions(allQuestions);
			setCurrentQuestion(allQuestions?.[0] || null);
			setCurrentQuestionIndex(0);
		}
	}, [session]);

	// Answer management functions
	const setQuestionAnswer = useCallback((questionId: string, answer: any) => {
		setQuestionAnswers((prev) => ({
			...prev,
			[questionId]: {
				questionId,
				answer,
				isAnswered:
					answer !== null && answer !== undefined && answer !== "",
				answeredAt: new Date().toISOString(),
				timeSpent: prev[questionId]?.timeSpent || 0,
			},
		}));
	}, []);

	const getQuestionAnswer = useCallback(
		(questionId: string): QuestionAnswer | null => {
			return questionAnswers[questionId] || null;
		},
		[questionAnswers]
	);

	const clearQuestionAnswer = useCallback((questionId: string) => {
		setQuestionAnswers((prev) => {
			const newState = { ...prev };
			delete newState[questionId];
			return newState;
		});
	}, []);

	const isQuestionAnswered = useCallback(
		(questionId: string): boolean => {
			return questionAnswers[questionId]?.isAnswered || false;
		},
		[questionAnswers]
	);

	// Navigation functions
	const goToNextQuestion = useCallback(() => {
		if (questions && currentQuestionIndex < questions.length - 1) {
			const nextIndex = currentQuestionIndex + 1;
			setCurrentQuestionIndex(nextIndex);
			setCurrentQuestion(questions[nextIndex]);
		}
	}, [questions, currentQuestionIndex]);

	const goToPreviousQuestion = useCallback(() => {
		if (currentQuestionIndex > 0) {
			const prevIndex = currentQuestionIndex - 1;
			setCurrentQuestionIndex(prevIndex);
			setCurrentQuestion(questions?.[prevIndex] || null);
		}
	}, [questions, currentQuestionIndex]);

	const goToQuestion = useCallback(
		(index: number) => {
			if (questions && index >= 0 && index < questions.length) {
				setCurrentQuestionIndex(index);
				setCurrentQuestion(questions[index]);
			}
		},
		[questions]
	);

	// Computed values
	const canGoNext = questions
		? currentQuestionIndex < questions.length - 1
		: false;
	const canGoPrevious = currentQuestionIndex > 0;
	const answeredCount = Object.values(questionAnswers).filter(
		(a) => a.isAnswered
	).length;
	const totalQuestions = questions?.length || 0;
	const progressPercentage =
		totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

	// Context value
	const contextValue: SessionContextState = {
		session,
		isLoading,
		error,
		refetchSession: fetchSession,
		questions,
		currentQuestion,
		setCurrentQuestion,
		currentQuestionIndex,

		// Form state
		questionAnswers,
		setQuestionAnswer,
		getQuestionAnswer,
		clearQuestionAnswer,
		isQuestionAnswered,

		// Navigation
		goToNextQuestion,
		goToPreviousQuestion,
		goToQuestion,
		canGoNext,
		canGoPrevious,

		// Progress
		answeredCount,
		totalQuestions,
		progressPercentage,
	};

	return (
		<SessionContext.Provider value={contextValue}>
			{children}
		</SessionContext.Provider>
	);
};
