// app/dashboard/page.tsx
"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import ApiService from "@/services/api.service";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SessionCard } from "../_components/session-card";
import { Session } from "@/interface/interview-session.interface";
import { ApiEndpoints } from "@/interface/api-response.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
	const [sessions, setSessions] = useState<Session[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
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

		fetchSessions();
	}, []);

	if (loading) {
		return (
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{[...Array(3)].map((_, i) => (
					<Card key={i}>
						<CardHeader>
							<Skeleton className="h-6 w-3/4" />
						</CardHeader>
						<CardContent className="space-y-4">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-2/3" />
							<div className="flex gap-2">
								<Skeleton className="h-6 w-16 rounded-full" />
								<Skeleton className="h-6 w-16 rounded-full" />
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Error loading sessions</CardTitle>
				</CardHeader>
				<CardContent>
					<p>{error}</p>
					<Button
						variant="outline"
						className="mt-4"
						onClick={() => window.location.reload()}
					>
						Retry
					</Button>
				</CardContent>
			</Card>
		);
	}

	if (sessions.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>No sessions found</CardTitle>
				</CardHeader>
				<CardContent>
					<p>You haven't created any interview sessions yet.</p>
					<Button variant="outline" className="mt-4">
						Create New Session
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{sessions?.map((session) => (
				<SessionCard key={session.id} session={session} />
			))}
		</div>
	);
}
