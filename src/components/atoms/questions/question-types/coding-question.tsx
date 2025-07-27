"use client";

import { Loader2, CheckCircle2, Send, AlertTriangle } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { editor } from "monaco-editor";
import Editor from "@monaco-editor/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "@/components/providers/session-form-provider";

// Programming Languages Support
const PROGRAMMING_LANGUAGES = [
	{
		id: "javascript",
		name: "JavaScript",
		monacoLanguage: "javascript",
		defaultCode:
			"// Write your JavaScript solution here\nfunction solution() {\n    // Your code here\n    return result;\n}\n\n// Test your solution\nconsole.log(solution());",
	},
	{
		id: "typescript",
		name: "TypeScript",
		monacoLanguage: "typescript",
		defaultCode:
			"// Write your TypeScript solution here\nfunction solution(): any {\n    // Your code here\n    return result;\n}\n\n// Test your solution\nconsole.log(solution());",
	},
	{
		id: "python",
		name: "Python",
		monacoLanguage: "python",
		defaultCode:
			"# Write your Python solution here\ndef solution():\n    # Your code here\n    return result\n\n# Test your solution\nprint(solution())",
	},
	{
		id: "java",
		name: "Java",
		monacoLanguage: "java",
		defaultCode:
			'// Write your Java solution here\npublic class Solution {\n    public static void main(String[] args) {\n        System.out.println("Result: " + solution());\n    }\n    \n    public static Object solution() {\n        // Your implementation here\n        return null;\n    }\n}',
	},
	{
		id: "cpp",
		name: "C++",
		monacoLanguage: "cpp",
		defaultCode:
			'#include <iostream>\n#include <vector>\n#include <string>\n\nusing namespace std;\n\nint main() {\n    // Your code here\n    cout << "Result: " << solution() << endl;\n    return 0;\n}\n\n// Your solution function\nauto solution() {\n    // Your implementation here\n    return 0;\n}',
	},
	{
		id: "csharp",
		name: "C#",
		monacoLanguage: "csharp",
		defaultCode:
			'using System;\n\npublic class Program\n{\n    public static void Main()\n    {\n        Console.WriteLine($"Result: {Solution()}");\n    }\n    \n    public static object Solution()\n    {\n        // Your implementation here\n        return null;\n    }\n}',
	},
];

export const CodingQuestionComponent: React.FC = () => {
	const {
		currentQuestion,
		setQuestionAnswer,
		getQuestionAnswer,
		questionAnswers,
	} = useSession();

	const [selectedLanguage, setSelectedLanguage] = useState(
		PROGRAMMING_LANGUAGES[0]
	);
	const [code, setCode] = useState("");
	const [isEditorReady, setIsEditorReady] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	// Initialize code when component mounts or question changes
	useEffect(() => {
		if (currentQuestion) {
			const existingAnswer = getQuestionAnswer(currentQuestion.id);
			if (existingAnswer?.answer) {
				setCode(existingAnswer.answer as string);
			} else {
				setCode(selectedLanguage.defaultCode);
			}
		}
	}, [currentQuestion, selectedLanguage, getQuestionAnswer]);

	// Handle language change
	const handleLanguageChange = useCallback(
		(languageId: string) => {
			const language = PROGRAMMING_LANGUAGES.find(
				(lang) => lang.id === languageId
			);
			if (language) {
				setSelectedLanguage(language);
				// Only change code if current code is default code of previous language
				if (code === selectedLanguage.defaultCode || !code.trim()) {
					setCode(language.defaultCode);
					if (currentQuestion) {
						setQuestionAnswer(
							currentQuestion.id,
							language.defaultCode
						);
					}
				}
			}
		},
		[code, selectedLanguage, currentQuestion, setQuestionAnswer]
	);

	// Handle code changes
	const handleCodeChange = useCallback(
		(newCode: string | undefined) => {
			if (newCode !== undefined) {
				setCode(newCode);
			}
		},
		[currentQuestion, setQuestionAnswer]
	);

	// Handle editor mount
	const handleEditorDidMount = (
		editorInstance: editor.IStandaloneCodeEditor
	) => {
		setIsEditorReady(true);

		// Configure editor
		editorInstance.updateOptions({
			fontSize: 14,
			lineHeight: 20,
			minimap: { enabled: window.innerWidth > 1024 },
			scrollBeyondLastLine: false,
			automaticLayout: true,
			tabSize: 2,
			insertSpaces: true,
			wordWrap: "on",
			bracketPairColorization: { enabled: true },
		});
	};

	// Handle code submission
	const handleSubmitCode = useCallback(async () => {
		if (!currentQuestion || !code.trim()) {
			setSubmitError("Please write some code before submitting");
			return;
		}

		setIsSubmitting(true);
		setSubmitError(null);

		try {
			// Prepare submission data
			const submissionData = {
				questionId: currentQuestion.id,
				code: code,
				language: selectedLanguage.id,
				timestamp: new Date().toISOString(),
				questionAnswers: questionAnswers, // Include all session answers
			};

			// Update the question answer with final submission
			setQuestionAnswer(currentQuestion.id, code);

			// Here you can add your API call to submit the code
			// Example:
			// await ApiService.post('/submit-code', submissionData);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Show success
			setSubmitSuccess(true);
			setTimeout(() => setSubmitSuccess(false), 3000);

			console.log("Code submitted successfully:", submissionData);
		} catch (error) {
			console.error("Error submitting code:", error);
			setSubmitError(
				error instanceof Error ? error.message : "Failed to submit code"
			);
		} finally {
			setIsSubmitting(false);
		}
	}, [
		currentQuestion,
		code,
		selectedLanguage,
		setQuestionAnswer,
		questionAnswers,
	]);

	// Check if code has been modified from default
	const hasModifiedCode =
		code.trim() !== selectedLanguage.defaultCode.trim() &&
		code.trim() !== "";

	// Show loading if no current question
	if (!currentQuestion) {
		return (
			<Alert>
				<Loader2 className="h-4 w-4 animate-spin" />
				<AlertDescription>Loading question...</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="space-y-4">
			{/* Language Selector */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Select
						value={selectedLanguage.id}
						onValueChange={handleLanguageChange}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{PROGRAMMING_LANGUAGES.map((language) => (
								<SelectItem
									key={language.id}
									value={language.id}
								>
									{language.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Submit Button */}
				<Button
					onClick={handleSubmitCode}
					disabled={!hasModifiedCode || isSubmitting}
					className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400"
				>
					{isSubmitting ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin" />
							Submitting...
						</>
					) : (
						<>
							<Send className="h-4 w-4" />
							Submit Code
						</>
					)}
				</Button>
			</div>

			{/* Success Message */}
			{submitSuccess && (
				<Alert className="border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
					<CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
					<AlertDescription className="text-green-700 dark:text-green-300 font-medium">
						✅ Code submitted successfully! Your solution has been
						saved.
					</AlertDescription>
				</Alert>
			)}

			{/* Error Message */}
			{submitError && (
				<Alert className="border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
					<AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
					<AlertDescription className="text-red-700 dark:text-red-300 font-medium">
						❌ {submitError}
					</AlertDescription>
				</Alert>
			)}

			{/* Code Editor */}
			<Card className="overflow-hidden border-2 border-muted hover:border-primary/50 transition-colors">
				<div style={{ height: "500px" }} className="relative">
					{!isEditorReady && (
						<div className="absolute inset-0 flex items-center justify-center bg-muted/10">
							<div className="flex items-center gap-2 text-muted-foreground">
								<Loader2 className="h-4 w-4 animate-spin" />
								<span>Loading code editor...</span>
							</div>
						</div>
					)}

					<Editor
						height="100%"
						language={selectedLanguage.monacoLanguage}
						value={code}
						onChange={handleCodeChange}
						onMount={handleEditorDidMount}
						theme={
							window.matchMedia("(prefers-color-scheme: dark)")
								.matches
								? "vs-dark"
								: "vs"
						}
						options={{
							selectOnLineNumbers: true,
							roundedSelection: false,
							cursorStyle: "line",
							automaticLayout: true,
							glyphMargin: true,
							folding: true,
							lineNumbers: "on",
							scrollbar: {
								vertical: "auto",
								horizontal: "auto",
								useShadows: false,
							},
						}}
						loading={
							<div className="flex items-center justify-center h-full">
								<div className="flex items-center gap-2 text-muted-foreground">
									<Loader2 className="h-4 w-4 animate-spin" />
									<span>Loading editor...</span>
								</div>
							</div>
						}
					/>
				</div>
			</Card>

			{/* Code Info */}
			<div className="flex items-center justify-between text-sm text-muted-foreground">
				<div className="flex items-center gap-4">
					<span>Lines: {code.split("\n").length}</span>
					<span>Characters: {code.length}</span>
				</div>
				{hasModifiedCode && (
					<Badge
						variant="secondary"
						className="flex items-center gap-1"
					>
						<CheckCircle2 className="h-3 w-3" />
						Code Modified
					</Badge>
				)}
			</div>
		</div>
	);
};
