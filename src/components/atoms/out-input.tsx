import React from "react";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";

interface InputOTPWithSeparatorProps {
	maxLength?: number; // Allow customizable maxLength for OTP length
	onChange?: (value: string) => void; // Callback to handle OTP value change
}

export function InputOTPWithSeparator({
	maxLength = 6,
	onChange,
}: InputOTPWithSeparatorProps) {
	const handleOTPChange = (value: string) => {
		if (onChange) {
			onChange(value);
		}
	};

	return (
		<InputOTP maxLength={maxLength} onChange={handleOTPChange}>
			<InputOTPGroup>
				<InputOTPSlot index={0} />
				<InputOTPSlot index={1} />
			</InputOTPGroup>
			<InputOTPSeparator />
			<InputOTPGroup>
				<InputOTPSlot index={2} />
				<InputOTPSlot index={3} />
			</InputOTPGroup>
			<InputOTPSeparator />
			<InputOTPGroup>
				<InputOTPSlot index={4} />
				<InputOTPSlot index={5} />
			</InputOTPGroup>
		</InputOTP>
	);
}
