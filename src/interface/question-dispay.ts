// types/question-display.types.ts
export interface QuestionDisplayProps {
	onFinishInterview: () => void;
  }
  
  export interface QuestionMetadata {
	type: {
	  label: string;
	  icon: string;
	  variant: 'default' | 'secondary' | 'destructive' | 'outline';
	  className: string;
	};
	difficulty: {
	  label: string;
	  icon: string;
	  variant: 'default' | 'secondary' | 'destructive' | 'outline';
	  className: string;
	};
  }
  
  export interface TimerState {
	timeSpent: number;
	isAutoSaving: boolean;
  }
  
  export interface NavigationState {
	canGoNext: boolean;
	canGoPrevious: boolean;
	isLastQuestion: boolean;
	currentIndex: number;
	totalQuestions: number;
  }
  