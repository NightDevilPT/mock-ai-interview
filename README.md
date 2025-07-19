# Mock Interview Generator POC Document

## Project Overview

This Proof of Concept (POC) will demonstrate a mock interview generator using Gemini AI API and LangChain in a Next.js application. The system will generate customized interview questions based on user parameters, present them in an interactive form, and provide detailed feedback on responses.

## Core Features

### 1. Question Generation API

-   **Input**: Accepts parameters like experience level, field type, question types, etc.
-   **Processing**: Uses LangChain with Gemini AI to generate context-aware questions
-   **Output**: Returns structured JSON with questions, options, metadata

### 2. Dynamic Form Rendering

-   Auto-generates forms based on question types (radio, checkbox, text, etc.)
-   Includes timers based on estimated question time
-   Responsive UI that adapts to different question formats

### 3. Evaluation & Feedback System

-   Analyzes user responses using AI
-   Provides detailed feedback with strengths and improvement areas
-   Generates motivational insights

### 4. Export & Share Functionality

-   Email results to user or recruiter
-   Export to PDF, Excel, JSON formats
-   Shareable links for results

### 5. Public Session Sharing

-   Users can create public interview sessions
-   Shareable sessions via unique tokens
-   Other users can attempt public sessions
-   Session creators can track attempts and performance

## Enhanced Requirements

### Input Parameters (Extended)

```typescript
interface InterviewRequest {
	title: string;
	description?: string;
	careerLevel: "Entry" | "Junior" | "Mid" | "Senior" | "Lead" | "Principal";
	experience: "0-2 years" | "2-5 years" | "5-10 years" | "10+ years";
	domain: string; // e.g., "Software Engineering", "Data Science"
	questionCount: number; // Range: 1-50
	questionTypes: Array<
		| "MULTIPLE_CHOICE"
		| "CHECKBOX"
		| "TEXT"
		| "DROPDOWN"
		| "RATING"
		| "CODING"
	>;
	focusAreas?: string[]; // e.g., ["React", "System Design"]
	difficulty: "EASY" | "MEDIUM" | "HARD" | "MIXED";
	isPublic?: boolean; // Whether session can be shared publicly
	estimatedDuration: number; // Total time in seconds
	scoringCriteria: {
		technical: number; // Percentage weight
		behavioral: number;
		situational: number;
	};
}
```

### Enhanced Response Structure

```typescript
interface InterviewResponse {
	success: boolean;
	data: {
		sessionId: string; // Unique identifier for the session
		shareToken?: string; // Token for public sharing
		metadata: {
			questionCount: number;
			estimatedDuration: number; // Total time in seconds
			difficulty: string;
			domain: string;
			generatedAt: string; // ISO timestamp
			focusAreas: string[];
			scoringCriteria: {
				technical: number; // Percentage weight
				behavioral: number;
				situational: number;
			};
		};
		questions: Array<{
			questionId: string; // e.g., "q_001"
			text: string;
			type:
				| "MULTIPLE_CHOICE"
				| "CHECKBOX"
				| "TEXT"
				| "DROPDOWN"
				| "RATING"
				| "CODING";
			category: string;
			difficulty: "EASY" | "MEDIUM" | "HARD";
			estimatedTime: number; // Seconds
			points: number;
			order: number;
			options?: Array<{
				id: string;
				text: string;
			}>;
			constraints?: {
				minLength?: number;
				maxLength?: number;
			};
			hints?: string[];
			tags?: string[];
			idealAnswer?: string; // For AI evaluation
		}>;
	};
	error?: {
		code: string; // e.g., "INVALID_INPUT"
		message: string;
		details?: any;
	};
}
```

## Database Collections

Here are the properly typed collections for your AI-based mock interview platform:

### User Collection

```typescript
interface User {
	id: string; // ObjectId
	email: string; // Unique
	password?: string;
	firstName: string;
	lastName: string;
	avatar?: string;
	bio?: string;
	authProvider: "EMAIL" | "GOOGLE" | "GITHUB" | "LINKEDIN";
	isVerified: boolean;
	token?: string; // Unique
	tokenExpired?: Date;

	// Dashboard analytics
	totalSessionsCreated: number;
	totalAttempts: number;
	averageScore?: number;
	strongestDomain?: string;
	improvementAreas: string[];
	lastActive?: Date;

	// Relations
	createdSessions: InterviewSession[];
	attempts: AttemptedSession[];
	responses: InterviewQuestionResponse[];

	createdAt: Date;
	updatedAt: Date;
}
```

### InterviewSession Collection

```typescript
interface InterviewSession {
	id: string; // ObjectId
	title: string;
	description?: string;
	careerLevel: string;
	experience: string;
	domain: string;
	difficulty: "EASY" | "MEDIUM" | "HARD" | "MIXED";
	questionTypes: (
		| "MULTIPLE_CHOICE"
		| "CHECKBOX"
		| "TEXT"
		| "DROPDOWN"
		| "RATING"
		| "CODING"
	)[];
	focusAreas: string[];
	isPublic: boolean;
	shareToken?: string; // Unique token for public sharing
	status: "DRAFT" | "PUBLISHED" | "ARCHIVED";

	// Metadata
	estimatedDuration: number;
	scoringCriteria: {
		technical: number;
		behavioral: number;
		situational: number;
	};

	// Relations
	creator: User;
	creatorId: string;
	questions: Question[];
	attempts: AttemptedSession[];

	createdAt: Date;
	updatedAt: Date;
}
```

### Question Collection

```typescript
interface Question {
	id: string; // ObjectId
	text: string;
	type:
		| "MULTIPLE_CHOICE"
		| "CHECKBOX"
		| "TEXT"
		| "DROPDOWN"
		| "RATING"
		| "CODING";
	category: string;
	difficulty: "EASY" | "MEDIUM" | "HARD";
	estimatedTime: number; // seconds, default 60
	order: number;
	points: number; // default 10
	options?: Array<{
		id: string;
		text: string;
	}>; // For MCQs
	constraints?: {
		minLength?: number;
		maxLength?: number;
	};
	hints: string[];
	tags: string[];
	idealAnswer?: string;

	// Relations
	session: InterviewSession;
	sessionId: string;
	responses: InterviewQuestionResponse[];

	createdAt: Date;
	updatedAt: Date;
}
```

### AttemptedSession Collection

```typescript
interface AttemptedSession {
	id: string; // ObjectId
	status: "STARTED" | "COMPLETED" | "EVALUATED" | "ABANDONED";
	score?: number;
	timeTaken?: number; // in seconds
	startedAt: Date;
	completedAt?: Date;

	// Relations
	originalSession: InterviewSession;
	originalSessionId: string;
	user: User;
	userId: string;
	responses: InterviewQuestionResponse[];
	feedback?: InterviewFeedback;

	createdAt: Date;
	updatedAt: Date;
}
```

### InterviewQuestionResponse Collection

```typescript
interface InterviewQuestionResponse {
	id: string; // ObjectId
	answer: any; // Can be string, string[], or object
	score?: number;
	timeTaken?: number; // in seconds
	answeredAt: Date;

	// Relations
	question: Question;
	questionId: string;
	attempt: AttemptedSession;
	attemptId: string;
	user?: User;
	userId?: string;
}
```

### InterviewFeedback Collection

```typescript
interface InterviewFeedback {
	id: string; // ObjectId
	overallScore: number;
	strengths: Array<{
		id: string;
		title: string;
		description: string;
	}>;
	improvementAreas: Array<{
		id: string;
		title: string;
		description: string;
	}>;
	resources: Array<{
		title: string;
		url: string;
	}>;
	aiAnalysis?: any;
	motivationalSummary: string;

	// Relations
	attempt: AttemptedSession;
	attemptId: string; // Unique

	createdAt: Date;
}
```

## Database Relationships

### Key Relationships:

1. **User → InterviewSession** (One-to-Many)

    - A user can create multiple interview sessions
    - Each session belongs to one creator

2. **InterviewSession → Question** (One-to-Many)

    - A session contains multiple questions
    - Each question belongs to one session

3. **User → AttemptedSession** (One-to-Many)

    - A user can attempt multiple sessions
    - Each attempt belongs to one user

4. **InterviewSession → AttemptedSession** (One-to-Many)

    - A session can be attempted by multiple users
    - Each attempt references one original session

5. **AttemptedSession → InterviewQuestionResponse** (One-to-Many)

    - An attempt contains multiple responses
    - Each response belongs to one attempt

6. **Question → InterviewQuestionResponse** (One-to-Many)

    - A question can have multiple responses across attempts
    - Each response answers one question

7. **AttemptedSession → InterviewFeedback** (One-to-One)
    - Each attempt has one feedback record
    - Each feedback belongs to one attempt

## Public Session Features

### Session Sharing Flow:

1. **Create Session**: User creates an interview session with `isPublic: true`
2. **Generate Share Token**: System generates unique `shareToken` for public access
3. **Share Session**: Creator shares the session via token/link
4. **Attempt Session**: Other users can attempt the session using the share token
5. **Track Attempts**: Creator can view all attempts and performance analytics

### Public Session Access:

-   **Public Sessions**: Accessible via share token without authentication
-   **Analytics**: Creators can view aggregated attempt statistics
-   **Privacy**: Individual attempt details are private to the attempter

## Enhanced Prompt Templates

### Question Generation Prompt

```javascript
const interviewPromptTemplate = new PromptTemplate({
	inputVariables: [
		"experience",
		"careerLevel",
		"domain",
		"numberOfQuestions",
		"questionTypes",
		"focusAreas",
		"difficulty",
	],
	template: `
	You are an expert {domain} interview coach with deep knowledge of the industry.
	Generate a mock interview session with {numberOfQuestions} questions for a {careerLevel}-level candidate
	with {experience} of experience.

	**Parameters:**
	- Domain: {domain}
	- Experience: {experience}
	- Career Level: {careerLevel}
	- Difficulty: {difficulty}
	- Question Types: {questionTypes.join(", ")}
	- Focus Areas: {focusAreas.join(", ")}

	**Output Format:**
	Return ONLY valid JSON matching the Question schema structure with proper types and all required fields.
	`,
});
```

### Evaluation Prompt

```javascript
const evaluationPromptTemplate = new PromptTemplate({
	inputVariables: ["questions", "answers", "userProfile"],
	template: `
	Analyze the interview performance of a {userProfile.careerLevel} {userProfile.domain} candidate
	with {userProfile.experience} experience.

	**Questions & Answers:**
	{JSON.stringify({ questions, answers }, null, 2)}

	**Provide:**
	1. Overall score (0-100)
	2. Detailed feedback per question
	3. Top 3 strengths
	4. Top 3 improvement areas
	5. Recommended resources
	6. Motivational summary

	Return as JSON matching the InterviewFeedback schema structure.
	`,
});
```

## Additional Features

1. **User Authentication & Profile Management**

    - Multi-provider authentication (Email, Google, GitHub, LinkedIn)
    - User dashboard with analytics and progress tracking
    - Profile customization with bio and avatar

2. **Advanced Analytics**

    - Performance trends over time
    - Domain-specific skill analysis
    - Comparison with peer benchmarks
    - Improvement tracking

3. **Learning Resources Integration**

    - AI-generated resource recommendations
    - Links to relevant documentation and courses
    - Personalized learning paths based on weak areas

4. **Enhanced Question Types**

    - Support for coding questions with syntax highlighting
    - Rating scale questions for soft skills assessment
    - Dropdown questions for specific technical choices

5. **Session Management**
    - Draft sessions for iterative creation
    - Session templates for common interview types
    - Archival system for old sessions

This enhanced POC demonstrates a comprehensive mock interview platform with social features, advanced analytics, and AI-powered personalization.
