// app/dashboard/page.tsx
"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import ApiService from "@/services/api.service";
import { ApiEndpoints } from "@/interface/api-response.interface";
import { Session } from "@/interface/interview-session.interface";
import { InterviewSessionDialog } from "./_components/session-form";
import { SessionCardSkeleton } from "@/components/atoms/session-card/session-card-skeleton";
import { SessionCard } from "@/components/atoms/session-card/session-card";

export default function DashboardPage() {
	const [sessions, setSessions] = useState<Session[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchSessions = async () => {
		try {
			setLoading(true);
			const response = await ApiService.get<{ sessions: Session[] }>(
				ApiEndpoints.GET_MY_SESSION
			);
			console.log(response, "CONSOLING RED");

			if (response.statusCode === 200 && response.data) {
				setSessions(response?.data?.sessions || []);
			} else {
				toast.error("Failed to fetch sessions");
				setError("Failed to load sessions");
			}
		} catch (err: any) {
			console.error("Error fetching sessions:", err);
			toast.error(err.message || "An error occurred");
			setError(err.message || "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = (session: Session) => {
		console.log("Edit session:", session);
		// TODO: Implement edit functionality
	};

	const handleDelete = (sessionId: string) => {
		console.log("Delete session:", sessionId);
		// TODO: Implement delete functionality
	};

	const handleShare = (session: Session) => {
		console.log("Share session:", session);
		// TODO: Implement share functionality
	};

	const handleStart = (session: Session) => {
		console.log("Start session:", session);
		// TODO: Navigate to interview page
	};

	const handleView = (session: Session) => {
		console.log("View session:", session);
		// TODO: Navigate to session details
	};

	useEffect(() => {
		fetchSessions();
	}, []);

	return (
		<div className="mx-auto p-6">
			<div className="flex justify-between items-center mb-6">
				<InterviewSessionDialog onSuccess={fetchSessions} />
			</div>

			{error && (
				<div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
					<p className="text-destructive">Error: {error}</p>
				</div>
			)}

			{/* Sessions Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{loading ? (
					// Show skeleton cards while loading
					Array.from({ length: 6 }).map((_, index) => (
						<SessionCardSkeleton key={index} />
					))
				) : sessions.length === 0 ? (
					// Empty state
					<div className="col-span-full text-center py-12">
						<div className="text-muted-foreground mb-4">
							<svg
								className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1}
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
							<h3 className="text-lg font-semibold mb-2">
								No sessions found
							</h3>
							<p>
								Create your first interview session to get
								started!
							</p>
						</div>
						<InterviewSessionDialog
							onSuccess={fetchSessions}
							trigger={
								<button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
									Create Your First Session
								</button>
							}
						/>
					</div>
				) : (
					// Render session cards
					sessions?.map((session) => (
						<SessionCard
							key={session.id}
							session={session}
							onEdit={handleEdit}
							onDelete={handleDelete}
							onShare={handleShare}
							onStart={handleStart}
							onView={handleView}
						/>
					))
				)}
			</div>
		</div>
	);
}
