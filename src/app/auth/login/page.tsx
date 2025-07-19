import React from "react";
import { LoginForm } from "./_components/login-form";

const page = () => {
	return <div className="w-full h-screen flex justify-center items-center p-5">
		<LoginForm className="w-3xl" />
	</div>;
};

export default page;
