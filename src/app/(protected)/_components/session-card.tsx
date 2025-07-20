import {
	Clock,
	HardHat,
	Target,
	Trophy,
	User,
	Zap,
	Lock,
	Globe,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Session } from "@/interface/interview-session.interface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export function SessionCard({ session }: { session: Session }) {
	const router = useRouter();
	const creatorInitials = `${session.creator.firstName.charAt(
		0
	)}${session.creator.lastName.charAt(0)}`;
	const completionRate =
		session._count.attempts > 0
			? Math.round((session._count.attempts / 10) * 100)
			: 0;

	const difficultyConfig = {
		EASY: {
			color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
			icon: <Zap className="h-4 w-4" />,
		},
		MEDIUM: {
			color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
			icon: <HardHat className="h-4 w-4" />,
		},
		HARD: {
			color: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
			icon: <Trophy className="h-4 w-4" />,
		},
	}[session.difficulty];

	return (
		<Card className="hover:shadow-md transition-all duration-200 group border-border/50 hover:border-border/70 dark:hover:border-border/60">
			<CardHeader className="flex flex-row items-start justify-between gap-4 pb-3 space-y-0">
				<div className="space-y-1.5">
					<CardTitle className="text-lg font-semibold tracking-tight line-clamp-1">
						{session.title}
					</CardTitle>
					<p className="text-sm text-muted-foreground line-clamp-2">
						{session.description || "No description provided"}
					</p>
				</div>
				<Tooltip>
					<TooltipTrigger asChild>
						<Avatar className="h-9 w-9 border border-border/50">
							<AvatarImage
								src={session.creator.avatar || undefined}
								alt={`${session.creator.firstName} ${session.creator.lastName}`}
							/>
							<AvatarFallback className="text-xs font-medium bg-muted/50">
								{creatorInitials}
							</AvatarFallback>
						</Avatar>
					</TooltipTrigger>
					<TooltipContent side="top" className="text-xs">
						<p>
							Created by {session.creator.firstName}{" "}
							{session.creator.lastName}
						</p>
					</TooltipContent>
				</Tooltip>
			</CardHeader>

			<CardContent className="space-y-4 pt-0">
				{/* Metadata Section */}
				<div className="grid grid-cols-2 gap-3">
					<div className="flex items-center gap-2">
						<User className="h-4 w-4 text-muted-foreground" />
						<div>
							<p className="text-xs text-muted-foreground">
								Level
							</p>
							<Badge
								variant="secondary"
								className="text-xs font-normal capitalize"
							>
								{session.careerLevel.toLowerCase()}
							</Badge>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Clock className="h-4 w-4 text-muted-foreground" />
						<div>
							<p className="text-xs text-muted-foreground">
								Experience
							</p>
							<Badge
								variant="secondary"
								className="text-xs font-normal capitalize"
							>
								{session.experience
									.replace(/_/g, " ")
									.toLowerCase()}
							</Badge>
						</div>
					</div>

					<div className="flex items-center gap-2">
						{difficultyConfig?.icon}
						<div>
							<p className="text-xs text-muted-foreground">
								Difficulty
							</p>
							<Badge
								className={`${difficultyConfig?.color} text-xs font-normal`}
							>
								{session.difficulty}
							</Badge>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Target className="h-4 w-4 text-muted-foreground" />
						<div>
							<p className="text-xs text-muted-foreground">
								Focus Areas
							</p>
							<Tooltip>
								<TooltipTrigger>
									<Badge
										variant="secondary"
										className="text-xs font-normal"
									>
										{session.focusAreas.length} selected
									</Badge>
								</TooltipTrigger>
								<TooltipContent className="max-w-[200px]">
									<div className="flex flex-wrap gap-1">
										{session.focusAreas.map((area) => (
											<Badge
												key={area}
												variant="outline"
												className="text-xs"
											>
												{area}
											</Badge>
										))}
									</div>
								</TooltipContent>
							</Tooltip>
						</div>
					</div>
				</div>

				{/* Stats Section */}
				<div className="grid grid-cols-4 gap-2 text-center">
					<div className="space-y-1">
						<p className="text-xs text-muted-foreground">
							Questions
						</p>
						<p className="text-sm font-medium">
							{session._count.questions}
						</p>
					</div>
					<div className="space-y-1">
						<p className="text-xs text-muted-foreground">Points</p>
						<p className="text-sm font-medium">
							{session.totalPoints}
						</p>
					</div>
					<div className="space-y-1">
						<p className="text-xs text-muted-foreground">
							Attempts
						</p>
						<p className="text-sm font-medium">
							{session._count.attempts}
						</p>
					</div>
					<div className="space-y-1">
						<p className="text-xs text-muted-foreground">Created</p>
						<p className="text-sm font-medium">
							{new Date(session.createdAt).toLocaleDateString(
								"en-US",
								{
									month: "short",
									day: "numeric",
								}
							)}
						</p>
					</div>
				</div>

				{/* Progress Bar */}
				{session._count.attempts > 0 && (
					<div className="space-y-1.5">
						<div className="flex justify-between text-xs text-muted-foreground">
							<span>Completion Rate</span>
							<span>{completionRate}%</span>
						</div>
						<Progress value={completionRate} className="h-1.5" />
					</div>
				)}
			</CardContent>

			<CardFooter className="flex justify-between items-center pt-0">
				<div className="flex gap-1 flex-wrap">
					{session.questionTypes.slice(0, 3).map((type) => (
						<Badge
							key={type}
							variant="outline"
							className="text-xs px-2 py-0.5 font-normal"
						>
							{type}
						</Badge>
					))}
					{session.questionTypes.length > 3 && (
						<Tooltip>
							<TooltipTrigger>
								<Badge
									variant="outline"
									className="text-xs px-2 py-0.5 font-normal"
								>
									+{session.questionTypes.length - 3}
								</Badge>
							</TooltipTrigger>
							<TooltipContent className="text-xs">
								{session.questionTypes.slice(3).join(", ")}
							</TooltipContent>
						</Tooltip>
					)}
				</div>

				<div className="flex gap-2">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
								onClick={() =>
									router.push(`/sessions/${session.id}`)
								}
							>
								{session.isPublic ? (
									<Globe className="h-4 w-4" />
								) : (
									<Lock className="h-4 w-4" />
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent className="text-xs">
							{session.isPublic
								? "Public Session"
								: "Private Session"}
						</TooltipContent>
					</Tooltip>
					<Button
						size="sm"
						className="h-8 px-3"
						onClick={() => router.push(`/sessions/${session.id}`)}
					>
						View
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
}
