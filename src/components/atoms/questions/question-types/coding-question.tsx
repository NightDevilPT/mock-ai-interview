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
import { CodeBlock } from "@/interface/interview-session.interface";
import { useSession } from "@/components/providers/session-form-provider";
import { ContentRenderer } from "@/components/molecules/content-render-container";
import { PROGRAMMING_LANGUAGES } from "@/interface/question-dispay";

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

    // Extract code blocks from question content
    const getCodeBlocksFromContent = useCallback(() => {
        if (!currentQuestion?.content) return [];
        
        return currentQuestion.content
            .filter(block => block.type === 'code')
            .map(block => block as CodeBlock)
            .sort((a, b) => a.order - b.order);
    }, [currentQuestion?.content]);

    // Get default code based on content or language template
    const getDefaultCode = useCallback((languageId: string) => {
        const codeBlocks = getCodeBlocksFromContent();
        
        // First, try to find a code block that matches the selected language
        const matchingCodeBlock = codeBlocks.find(
            block => block.data.language.toLowerCase() === languageId.toLowerCase()
        );
        
        if (matchingCodeBlock) {
            return matchingCodeBlock.data.code;
        }
        
        // If no matching language found, use the first code block if available
        if (codeBlocks.length > 0) {
            return codeBlocks[0].data.code;
        }
        
        // Fallback to language template
        const language = PROGRAMMING_LANGUAGES.find(lang => lang.id === languageId);
        return language?.defaultCode || "";
    }, [getCodeBlocksFromContent]);

    // Initialize language based on content
    useEffect(() => {
        if (currentQuestion) {
            const codeBlocks = getCodeBlocksFromContent();
            
            if (codeBlocks.length > 0) {
                // Try to set language based on first code block
                const firstCodeBlock = codeBlocks[0];
                const matchingLanguage = PROGRAMMING_LANGUAGES.find(
                    lang => lang.monacoLanguage.toLowerCase() === firstCodeBlock.data.language.toLowerCase()
                );
                
                if (matchingLanguage) {
                    setSelectedLanguage(matchingLanguage);
                }
            }
        }
    }, [currentQuestion, getCodeBlocksFromContent]);

    // Initialize code when component mounts or question changes
    useEffect(() => {
        if (currentQuestion) {
            const existingAnswer = getQuestionAnswer(currentQuestion.id);
            if (existingAnswer?.answer) {
                setCode(existingAnswer.answer as string);
            } else {
                const defaultCode = getDefaultCode(selectedLanguage.id);
                setCode(defaultCode);
                // Auto-save the default code
                setQuestionAnswer(currentQuestion.id, defaultCode);
            }
        }
    }, [currentQuestion, selectedLanguage, getQuestionAnswer, getDefaultCode, setQuestionAnswer]);

    // Handle language change
    const handleLanguageChange = useCallback(
        (languageId: string) => {
            const language = PROGRAMMING_LANGUAGES.find(
                (lang) => lang.id === languageId
            );
            if (language) {
                setSelectedLanguage(language);
                
                // Get existing answer
                const existingAnswer = getQuestionAnswer(currentQuestion?.id || "");
                
                // Only change code if:
                // 1. No existing answer, OR
                // 2. Current code matches the previous language's default code
                const shouldUpdateCode = !existingAnswer?.answer || 
                    code === getDefaultCode(selectedLanguage.id) || 
                    !code.trim();

                if (shouldUpdateCode) {
                    const newDefaultCode = getDefaultCode(languageId);
                    setCode(newDefaultCode);
                    if (currentQuestion) {
                        setQuestionAnswer(currentQuestion.id, newDefaultCode);
                    }
                }
            }
        },
        [code, selectedLanguage, currentQuestion, setQuestionAnswer, getQuestionAnswer, getDefaultCode]
    );

    // Handle code changes
    const handleCodeChange = useCallback(
        (newCode: string | undefined) => {
            if (newCode !== undefined) {
                setCode(newCode);
                // Auto-save on change
                if (currentQuestion) {
                    setQuestionAnswer(currentQuestion.id, newCode);
                }
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
                questionAnswers: questionAnswers,
            };

            // Update the question answer with final submission
            setQuestionAnswer(currentQuestion.id, code);

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
    const hasModifiedCode = useCallback(() => {
        const currentDefaultCode = getDefaultCode(selectedLanguage.id);
        return code.trim() !== currentDefaultCode.trim() && code.trim() !== "";
    }, [code, selectedLanguage.id, getDefaultCode]);

    // Show loading if no current question
    if (!currentQuestion) {
        return (
            <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>Loading question...</AlertDescription>
            </Alert>
        );
    }

    const codeBlocks = getCodeBlocksFromContent();

    return (
        <div className="space-y-4">
            {/* Content Renderer - Show content but exclude code blocks since we're using them as default */}
            {currentQuestion.content && currentQuestion.content.length > 0 && (
                <div className="space-y-4">
                    <ContentRenderer
                        content={currentQuestion.content.filter(block => block.type !== 'code')}
                    />
                    
                    {/* Show info about available code templates */}
                    {codeBlocks.length > 0 && (
                        <Alert className="border-muted bg-muted/20">
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                            <AlertDescription className="text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <span>💡 Default code template loaded from question content</span>
                                    <Badge variant="secondary" className="text-xs">
                                        {codeBlocks.length} template{codeBlocks.length > 1 ? 's' : ''} available
                                    </Badge>
                                </div>
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            )}

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
                            {PROGRAMMING_LANGUAGES.map((language) => {
                                const hasContentForLanguage = codeBlocks.some(
                                    block => block.data.language.toLowerCase() === language.monacoLanguage.toLowerCase()
                                );
                                
                                return (
                                    <SelectItem
                                        key={language.id}
                                        value={language.id}
                                    >
                                        <div className="flex items-center gap-2">
                                            {language.name}
                                            {hasContentForLanguage && (
                                                <Badge variant="secondary" className="text-xs">
                                                    Template
                                                </Badge>
                                            )}
                                        </div>
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>

                {/* Submit Button */}
                <Button
                    onClick={handleSubmitCode}
                    disabled={!hasModifiedCode() || isSubmitting}
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
                        ✅ Code submitted successfully! Your solution has been saved.
                    </AlertDescription>
                </Alert>
            )}

            {/* Error Message */}
            {submitError && (
                <Alert className="border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <AlertDescription className="text-red-700 dark:text-red-300 font-medium">
                        {submitError}
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
                    {codeBlocks.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                            Using content template
                        </Badge>
                    )}
                </div>
                {hasModifiedCode() && (
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
