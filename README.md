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

## Enhanced Requirements

### Input Parameters (Extended)

```typescript
interface InterviewRequest {
	careerLevel: "Entry" | "Junior" | "Mid" | "Senior" | "Lead" | "Principal";
	experience: "0-2 years" | "2-5 years" | "5-10 years" | "10+ years";
	domain: string; // e.g., "Software Engineering", "Data Science"
	questionCount: number; // Range: 1-50
	questionFormats: Array<
		"multiple-choice" | "checkbox" | "text" | "dropdown" | "rating"
	>;
	focusAreas?: string; // Optional, e.g., "Focus on React and system design"
	difficulty: "Easy" | "Medium" | "Hard" | "Mixed";
	language?: string; // e.g., "English", "Spanish" for localization
}
```

### Enhanced Response Structure

```typescript
interface InterviewResponse {
	success: boolean;
	data: {
		sessionId: string; // Unique identifier for the session
		metadata: {
			questionCount: number;
			estimatedDuration: number; // Total time in seconds
			difficulty: string;
			domain: string;
			generatedAt: string; // ISO timestamp
			expiresAt?: string; // Optional session expiration (e.g., 24 hours)
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
			format:
				| "multiple-choice"
				| "checkbox"
				| "text"
				| "dropdown"
				| "rating";
			category: string;
			difficulty: "easy" | "medium" | "hard";
			estimatedTime: number; // Seconds
			points: number;
			order: number;
			options?: Array<{
				id: string;
				text: string;
				value: string;
			}>;
			constraints?: {
				minLength?: number;
				maxLength?: number;
			};
			evaluationCriteria?: Array<{
				id: string;
				title: string;
				description: string;
			}>; // e.g., ["Clarity", "Depth"]
			hints?: Array<{
				id: string;
				title: string;
				description: string;
			}>;
			tags?: Array<{
				id: string;
				title: string;
				description: string;
			}>;
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

## Additional Features to Consider

1. **User Authentication**:

    - Save interview history
    - Track progress over time
    - Compare performance across attempts

2. **Learning Resources**:

    - Suggested resources based on weak areas
    - Links to documentation for technical questions
    - Recommended courses/tutorials

3. **Performance Analytics**:
    - Score trends over time
    - Benchmark against peers
    - Skill gap analysis

This POC will demonstrate the viability of using AI to create personalized, interactive mock interviews with valuable feedback. The modular design allows for future expansion into more specialized domains and advanced features.

Here's a comprehensive LangChain prompt template in JavaScript that you can use for generating mock interview questions based on your requirements:

````javascript
const { PromptTemplate } = require("langchain/prompts");

const interviewPromptTemplate = new PromptTemplate({
	inputVariables: [
		"experience",
		"level",
		"fieldType",
		"numberOfQuestions",
		"questionTypes",
		"customText",
		"difficulty",
	],
	template: `
  You are an expert {fieldType} interview coach with deep knowledge of the industry.
  Generate a mock interview session with {numberOfQuestions} questions for a {level}-level candidate
  with {experience} of experience.

  **Parameters:**
  - Field: {fieldType}
  - Experience: {experience}
  - Level: {level}
  - Difficulty: {difficulty}
  - Question Types: {questionTypes.join(", ")}
  - Custom Instructions: {customText || "None"}
  {additionalParams ? "- Additional: " + JSON.stringify(additionalParams) : ""}

  **Question Requirements:**
  1. Include a mix of: {questionTypes.join(", ")} type questions
  2. Vary difficulty based on: {difficulty}
  3. Cover these areas: {additionalParams?.focusAreas ? additionalParams.focusAreas.join(", ") : "technical, behavioral"}
  4. {additionalParams?.specificTechnologies ? "Focus on: " + additionalParams.specificTechnologies.join(", ") : ""}

  **Output Format Instructions:**
  - Return ONLY valid JSON matching this structure:
  {{
    "metadata":  {
			questionCount: number;
			estimatedDuration: number; // Total time in seconds
			difficulty: string;
			domain: string;
			generatedAt: string; // ISO timestamp
			expiresAt?: string; // Optional session expiration (e.g., 24 hours)
			focusAreas: string[];
			scoringCriteria: {
				technical: number; // Percentage weight
				behavioral: number;
				situational: number;
			};
		};
    "questions": Array<{
			questionId: string; // e.g., "q_001"
			text: string;
			format:
				| "multiple-choice"
				| "checkbox"
				| "text"
				| "dropdown"
				| "rating";
			category: string;
			difficulty: "easy" | "medium" | "hard";
			estimatedTime: number; // Seconds
			points: number;
			order: number;
			options?: Array<{
				id: string;
				text: string;
				value: string;
			}>;
			constraints?: {
				minLength?: number;
				maxLength?: number;
			};
			evaluationCriteria?: Array<{
				id: string;
				title: string;
				description: string;
			}>; // e.g., ["Clarity", "Depth"]
			hints?: Array<{
				id: string;
				title: string;
				description: string;
			}>;
			tags?: Array<{
				id: string;
				title: string;
				description: string;
			}>;
			idealAnswer?: string; // For AI evaluation
		}>
  }}

  **Special Instructions:**
  - Ensure questions are practical and relevant to real interviews
  - Include at least 1 challenging question for the level
  - For text responses, provide evaluation criteria
  - For multiple choice, include plausible distractors
  `,
});

### Enhanced Evaluation Prompt (for analyzing responses):

```javascript
const evaluationPromptTemplate = new PromptTemplate({
	inputVariables: ["questions", "answers", "userProfile"],
	template: `
  Analyze the interview performance of a {userProfile.level} {userProfile.fieldType} candidate
  with {userProfile.experience} experience.

  **Interview Questions:**
  {JSON.stringify(questions, null, 2)}

  **Candidate Answers:**
  {JSON.stringify(answers, null, 2)}

  Provide detailed feedback with:
  1. Overall score (0-100) based on:
     - Technical accuracy (for technical questions)
     - Response structure (for behavioral questions)
     - Completeness of answers
  2. Breakdown per question:
     - What was good
     - What could be improved
     - Sample better answer (if applicable)
  3. Top 3 strengths
  4. Top 3 areas for improvement
  5. Recommended learning resources
  6. Motivational summary

  Return as JSON with this structure:
  {{
    "overallScore": number,
    "feedbackByQuestion": Array<{{
      "questionId": string,
      "score": number,
      "strengths": string[],
      "improvements": string[],
      "betterAnswerExample"?: string
    }}>,
    "topStrengths": string[],
    "improvementAreas": string[],
    "resources": Array<{{title: string, url: string}}>,
    "motivationalSummary": string
  }}
  `,
});
````

## Collections

Here are the properly typed collections for your AI-based mock interview platform:

---

### InterviewSessions

```ts
interface InterviewSession {
	_id: ObjectId;
	sessionId: string; // e.g., "session_abc123"
	userId?: ObjectId; // Optional for guest users
	careerLevel: string;
	experience: string;
	domain: string;
	difficulty: string;
	questionFormats: string[];
	focusAreas?: string;
	metadata: {
		questionCount: number;
		estimatedDuration: number; // Seconds
		generatedAt: Date;
		expiresAt?: Date; // Optional session expiration
		scoringCriteria: {
			technical: number;
			behavioral: number;
			situational: number;
		};
	};
	questions: ObjectId[]; // References to Questions collection
	createdAt: Date;
	updatedAt: Date;
}
```

---

### Questions

```ts
interface Question {
	_id: ObjectId;
	sessionId: string;
	questionId: string; // e.g., "q_001"
	text: string;
	format: string;
	category: string;
	difficulty: string;
	estimatedTime: number; // Seconds
	points: number;
	order: number;
	options?: Array<{
		id: string;
		text: string;
		value: string;
	}>;
	constraints?: {
		minLength?: number;
		maxLength?: number;
	};
	hints?: string[];
	tags?: string[];
	createdAt: Date;
	updatedAt: Date;
}
```

---

### InterviewQuestionResponses

```ts
interface InterviewQuestionResponse {
	_id: ObjectId;
	sessionId: string;
	userId?: ObjectId;
	questionId: string;
	answer: string | string[] | number; // Depends on question format
	answeredAt: Date;
	score?: number;
	evaluation?: {
		strengths?: Array<{ id: string; title: string; description: string }>;
		improvements?: Array<{
			id: string;
			title: string;
			description: string;
		}>;
		betterAnswerExample?: string;
	};
	createdAt: Date;
}
```

---

### InterviewFeedback

```ts
interface InterviewFeedback {
	_id: ObjectId;
	sessionId: string;
	overallScore: number; // 0-100
	topStrengths: Array<{ id: string; title: string; description: string }>;
	improvementAreas: Array<{ id: string; title: string; description: string }>;
	resources: Array<{ title: string; url: string }>;
	motivationalSummary: string;
	createdAt: Date;
}
```
