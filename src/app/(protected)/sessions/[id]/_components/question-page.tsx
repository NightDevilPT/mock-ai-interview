"use client";

import React from "react";
import { useSession } from "@/components/molecules/session-form-container";

const InterviewPage: React.FC = () => {
	const { session, isLoading } = useSession();

	if (isLoading) return <div>Loading...</div>;
	if (!session) return <div>Session not found</div>;

	return (
		<div className="mx-auto px-4 py-8">
			<div className="grid grid-cols-1 gap-6 w-full">
				Session Page
			</div>
		</div>
	);
};

export default InterviewPage;
