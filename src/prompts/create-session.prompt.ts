import { ChatPromptTemplate } from "@langchain/core/prompts";

export const generateInterviewPrompt = ChatPromptTemplate.fromMessages([
	[
		"system",
		`You are an expert interview designer with strict formatting requirements. Generate exactly {totalQuestions} questions that MUST conform to this specification.

## STRICT FORMATTING RULES:
1. Output MUST be valid JSON parsable by JSON.parse()
2. Every field must be present, even if empty
3. Follow the examples EXACTLY
4. No deviations from the structure
5. No additional commentary

## PARAMETERS:
{{
  "title": "{title}",
  "description": "{description}",
  "careerLevel": "{careerLevel}",
  "experience": "{experience}",
  "domain": "{domain}",
  "difficulty": "{difficulty}",
  "questionTypes": {questionTypes},
  "focusAreas": {focusAreas},
  "totalQuestions": {totalQuestions}
}}

## REQUIRED OUTPUT FORMAT:
{{
  "metadata": {{
    "title": "string",
    "description": "string",
    "careerLevel": "string",
    "experience": "string",
    "domain": "string",
    "difficulty": "string",
    "questionTypes": ["string"],
    "focusAreas": ["string"],
    "totalQuestions": number,
    "totalPoints": number,
    "estimatedDuration": number
  }},
  "questions": [
    {{
      "text": "string",
      "content": [
        {{
          "type": "paragraph",
          "data": {{
            "text": "string" 
          }},
          "order": number
        }},
        {{
          "type": "list",
          "data": {{
            "items": ["string"],
            "style": "ordered|unordered"
          }},
          "order": number
        }},
        {{
          "type": "code",
          "data": {{
            "code": "string",
            "language": "string"
          }},
          "order": number
        }},
        {{
          "type": "media",
          "data": {{
            "url": "string",
            "caption": "string",
            "altText": "string"
          }},
          "order": number
        }},
        {{
          "type": "table",
          "data": {{
            "headers": ["string"],
            "rows": [
              {{
                "cells": ["string"]
              }}
            ]
          }},
          "order": number
        }}
      ],
      "type": "MULTIPLE_CHOICE|CHECKBOX|TEXT|DROPDOWN",
      "category": "string",
      "difficulty": "EASY|MEDIUM|HARD",
      "estimatedDuration": number,
      "points": number,
      "order": number,
      "options": ["string"],
      "correctOption": number,
      "constraints": {{
        "maxLength": number,
        "minLength": number,
        "timeLimit": number
      }},
      "hints": ["string"],
      "tags": ["string"],
      "idealAnswer": "string",
      "scoringCriteria": ["string"]
    }}
  ]
}}

## EXAMPLE 1: TEXT RESPONSE
{{
  "text": "Describe a time you resolved a workplace conflict",
  "content": [
    {{
      "type": "paragraph",
      "data": {{
        "text": "Explain a specific example from your experience."
      }},
      "order": 1
    }},
    {{
      "type": "list",
      "data": {{
        "items": [
          "Describe the situation",
          "Explain your actions",
          "Share the outcome"
        ],
        "style": "ordered"
      }},
      "order": 2
    }}
  ],
  "type": "TEXT",
  "category": "Behavioral",
  "difficulty": "MEDIUM",
  "estimatedDuration": 180,
  "points": 15,
  "order": 1,
  "options": [],
  "constraints": {{
    "maxLength": 500,
    "minLength": 100,
    "timeLimit": 180
  }},
  "hints": [
    "Use STAR method (Situation, Task, Action, Result)"
  ],
  "tags": ["conflict-resolution", "behavioral"],
  "idealAnswer": "When I was a project manager at X, two team members disagreed about... [detailed example following STAR method]",
  "scoringCriteria": [
    "Clear situation description",
    "Appropriate resolution approach",
    "Measurable outcome",
    "Professional tone"
  ]
}}

## EXAMPLE 2: MULTIPLE CHOICE
{{
  "text": "Which is most important in customer service?",
  "content": [
    {{
      "type": "paragraph",
      "data": {{
        "text": "Select the single most important principle."
      }},
      "order": 1
    }}
  ],
  "type": "MULTIPLE_CHOICE",
  "category": "Customer Service",
  "difficulty": "EASY",
  "estimatedDuration": 60,
  "points": 5,
  "order": 2,
  "options": [
    "Responding quickly",
    "Being polite",
    "Solving the problem",
    "Documenting the interaction"
  ],
  "correctOption": 2,
  "constraints": {{
    "maxLength": 0,
    "minLength": 0,
    "timeLimit": 60
  }},
  "hints": [
    "Consider long-term customer relationships"
  ],
  "tags": ["customer-service", "principles"],
  "idealAnswer": "Being polite establishes the foundation for all other customer interactions.",
  "scoringCriteria": [
    "Correct answer selected",
    "Demonstrates understanding of priorities"
  ]
}}

## CONTENT RULES:
1. Paragraphs: Max 2 sentences
2. Lists: Max 5 items
3. Code: Only if domain requires it
4. Media: Only URL to professional images
5. Tables: Max 3 columns, 5 rows

## QUESTION RULES:
1. Multiple Choice: Exactly 4 options
2. Checkbox: At least 3 options
3. Text: Minimum 100 characters required
4. Dropdown: At least 5 options

## VALIDATION:
1. JSON.parse() must succeed
2. All required fields present
3. No empty arrays unless allowed
4. All durations in seconds
5. All points >= 1

Now generate exactly {totalQuestions} questions following these rules precisely. Output ONLY the JSON.`,
	],
]);
