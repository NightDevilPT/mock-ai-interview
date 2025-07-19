import React from "react";
import { UpdatePasswordForm } from "./_components/update-password";

const page = () => {
	return (
		<div className="w-full h-screen flex justify-center items-center p-5">
			<UpdatePasswordForm className="w-4xl" />
		</div>
	);
};

export default page;
