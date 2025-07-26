import React from "react";
import { Building, DiffIcon, User } from "lucide-react";
import { Session } from "@/interface/interview-session.interface";

interface SessionHeroProps {
	session: Session;
	difficultyConfig: {
		color: string;
		icon: string;
		bgGradient: string;
	};
}

const SessionHero: React.FC<SessionHeroProps> = ({
	session,
	difficultyConfig,
}) => {
	return (
		<div className="relative overflow-hidden">
			<div className="relative text-center space-y-2 px-8">
				<h1 className="text-3xl md:text-4xl font-bold">
					{session.title}
				</h1>

				{session.description && (
					<p className="text-slate-600  mx-auto leading-relaxed">
						{session.description}
					</p>
				)}

				<div className="flex flex-wrap justify-center gap-3">
					<div className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-full">
						<DiffIcon className="w-4 h-4" />
						{session.difficulty}
					</div>
					<div className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-full">
						<Building className="w-4 h-4" />
						{session.domain}
					</div>
					<div className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-full">
						<User className="w-4 h-4" />
						{session.careerLevel}
					</div>
				</div>
			</div>
		</div>
	);
};

export default SessionHero;
