import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const SessionOverviewSkeleton = () => {
	return (
		<div className="min-h-screen">
			<div className="max-w-7xl mx-auto space-y-5">
				{/* Hero Section Skeleton */}
				<div className="relative overflow-hidden">
					<div className="relative text-center space-y-6 px-8">
						{/* Professional badge skeleton */}
						<div className="inline-flex items-center space-x-2 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
							<Skeleton className="h-4 w-4 rounded-full" />
							<Skeleton className="h-4 w-48" />
						</div>

						{/* Title skeleton */}
						<Skeleton className="h-12 w-3/4 mx-auto" />

						{/* Description skeleton */}
						<div className="space-y-2">
							<Skeleton className="h-6 w-2/3 mx-auto" />
							<Skeleton className="h-6 w-1/2 mx-auto" />
						</div>

						{/* Badges skeleton */}
						<div className="flex flex-wrap justify-center gap-3 mt-6">
							<Skeleton className="h-8 w-24 rounded-full" />
							<Skeleton className="h-8 w-32 rounded-full" />
							<Skeleton className="h-8 w-28 rounded-full" />
						</div>
					</div>
				</div>

				{/* Key Metrics Skeleton */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{[1, 2, 3, 4].map((i) => (
						<Card key={i} className="border-0 shadow-md">
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div className="space-y-2">
										<Skeleton className="h-4 w-24" />
										<Skeleton className="h-8 w-16" />
									</div>
									<Skeleton className="h-12 w-12 rounded-2xl" />
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Main Content Grid Skeleton */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Session Configuration Skeleton */}
					<div className="lg:col-span-2 space-y-6">
						{/* Configuration Card */}
						<Card className="border-0 shadow-lg">
							<CardHeader className="">
								<div className="flex items-center">
									<Skeleton className="h-8 w-8 rounded-lg mr-3" />
									<Skeleton className="h-6 w-48" />
								</div>
							</CardHeader>
							<CardContent className="p-6 space-y-6">
								{/* Session Details Section */}
								<div className="space-y-4">
									<Skeleton className="h-4 w-32" />
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{[1, 2, 3, 4].map((i) => (
											<Card
												key={i}
												className=""
											>
												<CardContent className="p-4">
													<div className="flex items-center justify-between">
														<div className="flex items-center space-x-3">
															<Skeleton className="h-8 w-8 rounded-lg" />
															<Skeleton className="h-4 w-20" />
														</div>
														<Skeleton className="h-6 w-16 rounded-full" />
													</div>
												</CardContent>
											</Card>
										))}
									</div>
								</div>

								<Separator className="my-8" />

								{/* Question Types Section */}
								<div className="space-y-4">
									<Skeleton className="h-4 w-40" />
									<Card className="border-0 shadow-sm">
										<CardHeader className="pb-3">
											<div className="flex items-center">
												<Skeleton className="h-8 w-8 rounded-lg mr-3" />
												<Skeleton className="h-5 w-32" />
											</div>
										</CardHeader>
										<CardContent>
											<div className="flex flex-wrap gap-3">
												{[1, 2, 3, 4].map((j) => (
													<Skeleton
														key={j}
														className="h-8 w-24 rounded-md"
													/>
												))}
											</div>
										</CardContent>
									</Card>
								</div>

								<Separator className="my-6" />

								{/* Focus Areas Section */}
								<div className="space-y-4">
									<Skeleton className="h-4 w-36" />
									<Card className="border-0 shadow-sm">
										<CardHeader className="pb-3">
											<div className="flex items-center">
												<Skeleton className="h-8 w-8 rounded-lg mr-3" />
												<Skeleton className="h-5 w-28" />
											</div>
										</CardHeader>
										<CardContent>
											<div className="flex flex-wrap gap-2">
												{[1, 2, 3].map((j) => (
													<Skeleton
														key={j}
														className="h-7 w-20 rounded-full"
													/>
												))}
											</div>
										</CardContent>
									</Card>
								</div>
							</CardContent>
						</Card>

						{/* Question Distribution Skeleton */}
						<Card className="border-0 shadow-lg">
							<CardHeader>
								<div className="flex items-center">
									<Skeleton className="h-6 w-6 mr-3" />
									<Skeleton className="h-6 w-44" />
								</div>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									{[1, 2, 3].map((i) => (
										<div
											key={i}
											className="text-center space-y-4"
										>
											<div className="p-6 rounded-2xl border">
												<Skeleton className="h-8 w-8 mx-auto mb-2" />
												<Skeleton className="h-6 w-16 mx-auto rounded-md" />
											</div>
											<div className="space-y-2">
												<div className="flex justify-between">
													<Skeleton className="h-4 w-20" />
													<Skeleton className="h-4 w-8" />
												</div>
												<Skeleton className="h-2 w-full rounded-full" />
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Sidebar Skeleton */}
					<div className="space-y-6">
						{/* Creator Info Skeleton */}
						<Card className="border-0 shadow-lg">
							<CardHeader>
								<div className="flex items-center">
									<Skeleton className="h-5 w-5 mr-2" />
									<Skeleton className="h-5 w-24" />
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-start space-x-4">
									<Skeleton className="h-16 w-16 rounded-full" />
									<div className="flex-1 space-y-2">
										<Skeleton className="h-5 w-32" />
										<Skeleton className="h-4 w-40" />
									</div>
								</div>

								<Separator />

								<div className="space-y-3">
									<div className="flex items-center space-x-3">
										<Skeleton className="h-4 w-4" />
										<Skeleton className="h-4 w-36" />
									</div>
									<div className="flex items-center space-x-3">
										<Skeleton className="h-4 w-4" />
										<Skeleton className="h-4 w-36" />
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Ready Status Skeleton */}
						<Card className="border-0 shadow-lg">
							<CardHeader>
								<div className="flex items-center">
									<Skeleton className="h-5 w-5 mr-2" />
									<Skeleton className="h-5 w-28" />
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								{[1, 2, 3].map((i) => (
									<div
										key={i}
										className="flex items-center justify-between py-2"
									>
										<Skeleton className="h-4 w-32" />
										<Skeleton className="h-5 w-5 rounded-full" />
									</div>
								))}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SessionOverviewSkeleton;
