import React from "react";
import { Badge } from "@/components/ui/badge";
import { Session } from "@/interface/interview-session.interface";

interface SessionHeroProps {
    session: Session;
    difficultyConfig: {
        color: string;
        icon: string;
        bgGradient: string;
    };
}

const SessionHero: React.FC<SessionHeroProps> = ({ session, difficultyConfig }) => {
    return (
        <div className="relative overflow-hidden">
            <div className="relative text-center space-y-6 px-8">
                <h1 className="text-4xl md:text-5xl font-bold">
                    {session.title}
                </h1>

                {session.description && (
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        {session.description}
                    </p>
                )}

                <div className="flex flex-wrap justify-center gap-3 mt-6">
                    <Badge className={`${difficultyConfig.color} px-4 py-2 text-sm font-medium border`}>
                        {difficultyConfig.icon} {session.difficulty}
                    </Badge>
                    <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
                        🏢 {session.domain}
                    </Badge>
                    <Badge variant="outline" className="px-4 py-2 text-sm font-medium">
                        👤 {session.careerLevel}
                    </Badge>
                </div>
            </div>
        </div>
    );
};

export default SessionHero;
