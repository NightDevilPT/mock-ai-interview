import React from "react";
import InterviewPage from "./_components/question-page";
import { SessionProvider } from "@/components/providers/session-form-provider";

export default async function page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	console.log("Session ID:", id);
	return id ? (
		<SessionProvider sessionId={id}>
			<InterviewPage />
		</SessionProvider>
	) : (
		<div>Session not found</div>
	);
}
