import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCw, Clock, Shield } from "lucide-react";

const SessionNotFound = () => {
	const handleRefresh = () => {
		window.location.reload();
	};

	const possibleReasons = [
		{
			icon: Clock,
			title: "Session Expired",
			description: "The session may have expired or been archived",
		},
		{
			icon: AlertTriangle,
			title: "Invalid Link",
			description: "The link you followed may be broken or outdated",
		},
		{
			icon: Shield,
			title: "Access Restricted",
			description: "You may not have permission to view this session",
		},
	];

	return (
		<div className="h-full">
			<div className="max-w-4xl mx-auto p-6 flex items-center justify-center h-full">
				<div className="w-full max-w-2xl space-y-8">
					{/* Main Error Card */}
					<Card className="bg-transparent border-none">
						<div className="p-1">
							<CardContent className="m-2 rounded-lg">
								<div className="text-center py-12 px-6 space-y-6">
									{/* Main Message */}
									<div className="space-y-3">
										<h1 className="text-3xl md:text-4xl font-bold">
											Session Not Found
										</h1>
										<p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
											We couldn't locate the interview
											session you're looking for. It may
											have been moved, deleted, or never
											existed.
										</p>
									</div>

									{/* Action Buttons */}
									<div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
										<Link href="/">
											<Button size="lg">
												<Home className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
												Go to Dashboard
											</Button>
										</Link>

										<Button
											variant="outline"
											size="lg"
											onClick={handleRefresh}
											className="border-slate-300 hover:bg-slate-50 group"
										>
											<RefreshCw className="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform duration-300" />
											Try Again
										</Button>
									</div>
								</div>
							</CardContent>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default SessionNotFound;
