import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SessionCardSkeleton() {
	return (
		<Card className="border-border/50">
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="flex-1 min-w-0">
						{/* Title */}
						<div className="flex items-center gap-2 mb-2">
							<Skeleton className="h-6 w-48" />
							<Skeleton className="h-4 w-4 rounded" />
						</div>

						{/* Description */}
						<Skeleton className="h-4 w-full mb-1" />
						<Skeleton className="h-4 w-3/4 mb-3" />

						{/* Meta Information */}
						<div className="flex items-center gap-4 mb-3">
							<Skeleton className="h-3 w-16" />
							<Skeleton className="h-3 w-20" />
							<Skeleton className="h-3 w-18" />
						</div>
					</div>

					<Skeleton className="h-8 w-8 rounded" />
				</div>
			</CardHeader>

			<CardContent className="pt-0">
				{/* Badges */}
				<div className="flex items-center gap-2 mb-4">
					<Skeleton className="h-5 w-16 rounded-full" />
					<Skeleton className="h-5 w-12 rounded-full" />
					<Skeleton className="h-5 w-14 rounded-full" />
				</div>

				{/* Domain and Experience */}
				<div className="space-y-2 mb-4">
					<div className="flex items-center justify-between">
						<Skeleton className="h-4 w-12" />
						<Skeleton className="h-4 w-24" />
					</div>
					<div className="flex items-center justify-between">
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-20" />
					</div>
					<div className="flex items-center justify-between">
						<Skeleton className="h-4 w-10" />
						<Skeleton className="h-4 w-8" />
					</div>
				</div>

				{/* Question Types */}
				<div className="mb-4">
					<Skeleton className="h-3 w-20 mb-2" />
					<div className="flex flex-wrap gap-1">
						<Skeleton className="h-5 w-16 rounded-full" />
						<Skeleton className="h-5 w-12 rounded-full" />
						<Skeleton className="h-5 w-14 rounded-full" />
					</div>
				</div>

				{/* Focus Areas */}
				<div className="mb-4">
					<Skeleton className="h-3 w-16 mb-2" />
					<div className="flex flex-wrap gap-1">
						<Skeleton className="h-5 w-12 rounded-full" />
						<Skeleton className="h-5 w-16 rounded-full" />
						<Skeleton className="h-5 w-20 rounded-full" />
					</div>
				</div>

				{/* Creator */}
				<div className="flex items-center gap-2 pt-2 border-t border-border/50">
					<Skeleton className="w-6 h-6 rounded-full" />
					<Skeleton className="h-3 w-24" />
				</div>
			</CardContent>

			<CardFooter className="pt-0">
				<div className="flex items-center justify-between w-full">
					<Skeleton className="h-8 w-16" />
					<Skeleton className="h-8 w-28" />
				</div>
			</CardFooter>
		</Card>
	);
}
