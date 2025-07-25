"use client";

import { Session } from "@/interface/interview-session.interface";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	CalendarDays,
	Clock,
	Eye,
	Globe,
	Lock,
	MoreVertical,
	Play,
	Share,
	Users,
	FileText,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface SessionCardProps {
	session: Session;
	onEdit?: (session: Session) => void;
	onDelete?: (sessionId: string) => void;
	onShare?: (session: Session) => void;
	onStart?: (session: Session) => void;
	onView?: (session: Session) => void;
}

export function SessionCard({
	session,
	onEdit,
	onDelete,
	onShare,
	onStart,
	onView,
}: SessionCardProps) {
	const getStatusBadgeVariant = (status: string) => {
		switch (status) {
			case "DRAFT":
				return "secondary";
			case "GENERATED":
				return "default";
			case "IN_PROGRESS":
				return "destructive";
			case "COMPLETED":
				return "outline";
			case "EVALUATED":
				return "default";
			default:
				return "secondary";
		}
	};

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty.toLowerCase()) {
			case "easy":
				return "bg-green-500/10 text-green-700 border-green-500/20";
			case "medium":
				return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
			case "hard":
				return "bg-red-500/10 text-red-700 border-red-500/20";
			case "mixed":
				return "bg-purple-500/10 text-purple-700 border-purple-500/20";
			default:
				return "bg-gray-500/10 text-gray-700 border-gray-500/20";
		}
	};

	return (
		<Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-border space-y-0 gap-0">
			<CardHeader className="">
				<div className="flex items-start justify-between">
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 mb-2">
							<h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
								{session.title}
							</h3>
							<div className="flex items-center gap-1">
								{session.isPublic ? (
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger>
												<Globe className="w-4 h-4 text-muted-foreground" />
											</TooltipTrigger>
											<TooltipContent>
												<p>Public session</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								) : (
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger>
												<Lock className="w-4 h-4 text-muted-foreground" />
											</TooltipTrigger>
											<TooltipContent>
												<p>Private session</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								)}
							</div>
						</div>

						{session.description && (
							<p className="text-sm text-muted-foreground line-clamp-2 mb-3">
								{session.description}
							</p>
						)}

						{/* Meta Information */}
						<div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
							<div className="flex items-center gap-1">
								<CalendarDays className="w-3 h-3" />
								<span>
									{formatDistanceToNow(
										new Date(session.createdAt),
										{ addSuffix: true }
									)}
								</span>
							</div>
							<div className="flex items-center gap-1">
								<FileText className="w-3 h-3" />
								<span>
									{session?._count &&
										session?._count.questions}{" "}
									questions
								</span>
							</div>
							<div className="flex items-center gap-1">
								<Users className="w-3 h-3" />
								<span>
									{session?._count && session._count.attempts}{" "}
									attempts
								</span>
							</div>
						</div>
					</div>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="opacity-0 group-hover:opacity-100 transition-opacity"
							>
								<MoreVertical className="w-4 h-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => onView?.(session)}>
								<Eye className="w-4 h-4 mr-2" />
								View Details
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => onEdit?.(session)}>
								<FileText className="w-4 h-4 mr-2" />
								Edit
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onShare?.(session)}
							>
								<Share className="w-4 h-4 mr-2" />
								Share
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => onDelete?.(session.id)}
								className="text-destructive focus:text-destructive"
							>
								<FileText className="w-4 h-4 mr-2" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				{/* Status and Difficulty */}
				<div className="flex items-center gap-2 mb-4">
					<Badge
						variant={getStatusBadgeVariant(session.status)}
						className="text-xs"
					>
						{session.status.replace("_", " ")}
					</Badge>
					<Badge
						variant="outline"
						className={`text-xs border ${getDifficultyColor(
							session.difficulty
						)}`}
					>
						{session.difficulty}
					</Badge>
					<Badge variant="outline" className="text-xs">
						{session.careerLevel.replace("_", " ")}
					</Badge>
				</div>

				{/* Domain and Experience */}
				<div className="space-y-2 mb-4">
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Domain:</span>
						<span className="font-medium">{session.domain}</span>
					</div>
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">
							Experience:
						</span>
						<span className="font-medium">
							{session.experience.replace(/_/g, " ")}
						</span>
					</div>
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Points:</span>
						<span className="font-medium">
							{session.totalPoints}
						</span>
					</div>
				</div>

				{/* Question Types */}
				{session.questionTypes.length > 0 && (
					<div className="mb-4">
						<p className="text-xs text-muted-foreground mb-2">
							Question Types:
						</p>
						<div className="flex flex-wrap gap-1">
							{session.questionTypes
								.slice(0, 3)
								.map((type, index) => (
									<Badge
										key={index}
										variant="secondary"
										className="text-xs"
									>
										{type.replace("_", " ")}
									</Badge>
								))}
							{session.questionTypes.length > 3 && (
								<Badge variant="secondary" className="text-xs">
									+{session.questionTypes.length - 3} more
								</Badge>
							)}
						</div>
					</div>
				)}

				{/* Focus Areas */}
				{session.focusAreas.length > 0 && (
					<div className="mb-4">
						<p className="text-xs text-muted-foreground mb-2">
							Focus Areas:
						</p>
						<div className="flex flex-wrap gap-1">
							{session.focusAreas
								.slice(0, 3)
								.map((area, index) => (
									<Badge
										key={index}
										variant="outline"
										className="text-xs"
									>
										{area}
									</Badge>
								))}
							{session.focusAreas.length > 3 && (
								<Badge variant="outline" className="text-xs">
									+{session.focusAreas.length - 3} more
								</Badge>
							)}
						</div>
					</div>
				)}
			</CardContent>

			<CardFooter className="flex justify-between items-center">
				{/* Creator */}
				<div className="flex items-center gap-2">
					<Tooltip>
						<TooltipTrigger>
							<Avatar className="w-8 h-8">
								<AvatarImage
									src={session.creator.avatar || undefined}
								/>
								<AvatarFallback className="text-xs bg-muted">
									{session.creator.firstName?.[0]}
									{session.creator.lastName?.[0]}
								</AvatarFallback>
							</Avatar>
						</TooltipTrigger>
						<TooltipContent>
							Created by {session.creator.firstName}{" "}
							{session.creator.lastName}
						</TooltipContent>
					</Tooltip>
				</div>
				<div className="flex items-center justify-end w-full gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => onView?.(session)}
					>
						<Eye className="w-4 h-4 mr-2" />
						View
					</Button>
					<Button size="sm" onClick={() => onStart?.(session)}>
						<Play className="w-4 h-4 mr-2" />
						Start Interview
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
}
