import React from "react";
import { SiTraefikproxy } from "react-icons/si";

const MockAiLogoIcon = ({
	size = 24,
	className = "",
}: {
	size?: number;
	className?: string;
}) => {
	return (
		<div
			className={`relative ${className}`}
			style={{ width: size, height: size }}
		>
			{/* AI Brain Icon */}
			<SiTraefikproxy
				className="text-primary absolute inset-0"
				size={size}
			/>
		</div>
	);
};

export default MockAiLogoIcon;
