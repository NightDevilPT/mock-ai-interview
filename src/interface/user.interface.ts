// Login and User Payload Interfaces
export interface ILogin {
	email: string;
	password: string;
}

// Register and Sign Up Interface
export interface ISignUp{
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

// Verify User Interface
export interface IVerifyUser {
	email: string;
	otp: string;
}

// Reset Password Interface
export interface IForgotPassword {
	email: string;
}

// Update Password Interface
export interface IUpdatePassword {
	email: string;
	otp: string;
	password: string;
}

// User Payload Interface
export interface UserPayload {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	isVerified: boolean;
}

