import React from "react";
import { Logo } from "./ui/icons";

const Navbar = () => {
	return (
		<div className="w-full h-16 bg-transparent flex items-center px-4">
			<div>
				<Logo />
			</div>
		</div>
	);
};

export default Navbar;
