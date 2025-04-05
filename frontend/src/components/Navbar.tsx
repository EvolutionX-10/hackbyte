"use client";

import React, { useEffect, useState } from "react";
import { Logo } from "./ui/icons";
import Link from "next/link";
import { useAuth } from "@/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


const Navbar = () => {
	const { jwt } = useAuth();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const router = useRouter();

	// useEffect(() => {
	// 	if (!jwt) {
	// 		router.push("/login");
	// 		toast.error("You need to login first.");
	// 	}
	// }, [jwt, router]);

	const { setJwt, setEmail } = useAuth.getState();
	const handleLogout = () => {
		// Clear auth data from Zustand store
		setJwt("");
		setEmail("");
		// Remove the persisted storage by the same key used in persist config
		localStorage.removeItem("auth-storage");
		toast.success("Logged out successfully.");
		router.push("/login");
	};

	const navLinks = [
		{ name: "Dashboard", path: "/dashboard" },
		{ name: "Learn", path: "/learn" },
	];

	return (
		<nav className="bg-background border-b border-lime-50 h-16 w-full px-8 py-4">
			<div className="flex items-center justify-between h-full w-full">
				<Link href="/">
					<div className="left flex items-center gap-4">
						<Logo />
						<span className="hidden md:block text-3xl font-semibold bg-gradient-to-r from-lime-500 via-lime-400 to-white bg-clip-text text-transparent">
							grow hack
						</span>
					</div>
				</Link>

				<div className="hidden md:flex items-center gap-4 font-semibold text-lg">
					{jwt && (
						<div className="flex items-center gap-4">
							{navLinks.map((link) => (
								<Link
									key={link.name}
									href={link.path}
									className="hover:text-lime-500 transition-colors duration-200 text-lg"
								>
									{link.name}
								</Link>
							))}

							<button onClick={handleLogout} className="ml-3 cursor-pointer">
								<span className="transition duration-300 ease-in-out font-medium text-lg px-5 py-2 rounded-sm bg-red-50 text-background hover:ring-2 hover:ring-red-400 hover:bg-red-500/30 hover:text-white">
									Logout
								</span>
							</button>
						</div>
					)}
					{!jwt && (
						<>
							<Link href="/login">
								<span className="transition duration-300 ease-in-out font-medium text-lg px-5 py-2 rounded-sm bg-lime-50 text-background hover:ring-2 hover:ring-lime-400 hover:bg-lime-500/30 hover:text-white">
									Login
								</span>
							</Link>
							<Link href="/sign-up">
								<span className="transition duration-300 ease-in-out font-medium text-lg px-5 py-2 rounded-sm bg-lime-500 text-white hover:ring-2 hover:ring-lime-50 hover:bg-lime-50/30">
									Register
								</span>
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
