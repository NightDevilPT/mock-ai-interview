// types/question-display.types.ts
export interface QuestionDisplayProps {
	onFinishInterview: () => void;
}

export interface QuestionMetadata {
	type: {
		label: string;
		icon: string;
		variant: "default" | "secondary" | "destructive" | "outline";
		className: string;
	};
	difficulty: {
		label: string;
		icon: string;
		variant: "default" | "secondary" | "destructive" | "outline";
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

export // Programming Languages Support
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
