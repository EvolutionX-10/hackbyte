"use client";

import React, { useState } from "react";
import { Logo } from "./ui/icons";
import Link from "next/link";
import { useAuth } from "@/store";

const Navbar = () => {
	const { jwt } = useAuth();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// Navigation links based on authentication status
	const renderNavLinks = (isMobile = false) => {
		const closeMenu = isMobile ? () => setIsMenuOpen(false) : () => {};

		return (
			<>
				{jwt ? (
					// Authenticated user links
					<>
						<Link href="/dashboard" onClick={closeMenu}>
							<span className="font-medium text-lg">dashboard</span>
						</Link>
						<Link href="/learn" onClick={closeMenu}>
							<span className="font-medium text-lg">learn</span>
						</Link>
						{/* Add logout functionality if needed */}
					</>
				) : (
					// Guest user links
					<>
						<Link href="/login" onClick={closeMenu}>
							<span className="transition duration-300 ease-in-out font-medium text-lg px-5 py-1 rounded-sm bg-lime-50 text-background hover:ring-2 hover:ring-lime-400 hover:bg-lime-500/30 hover:text-white">
								login
							</span>
						</Link>
						<Link href="/sign-up" onClick={closeMenu}>
							<span className="transition duration-300 ease-in-out font-medium text-lg px-5 py-1 rounded-sm bg-lime-500 text-white hover:ring-2 hover:ring-lime-50 hover:bg-lime-50/30">
								register
							</span>
						</Link>
					</>
				)}
			</>
		);
	};

	return (
		<>
			{/* Navbar Container */}
			<div className="bg-background/10 backdrop-blur-sm w-full h-16 flex items-center justify-between px-8 py-4 sticky top-0 z-40">
				{/* Logo Section */}
				<Link href="/">
					<div className="flex items-center gap-2">
						<Logo />
						<span className="font-semibold bg-gradient-to-r from-lime-500 via-lime-400 to-white bg-clip-text text-transparent text-2xl">
							grow hack
						</span>
					</div>
				</Link>

				{/* Navigation and Hamburger Container */}
				<div className="flex items-center gap-6">
					{/* Desktop Navigation Links */}
					<div className="hidden lg:flex items-center gap-6 text-white">{renderNavLinks()}</div>

					{/* Hamburger Menu Button (Visible on Mobile) */}
					<button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden">
						<div className="flex flex-col justify-center items-center">
							<div
								className={`bg-white h-0.5 w-6 mb-1 transition-all duration-300 ${
									isMenuOpen ? "rotate-45 translate-y-1.5" : ""
								}`}
							/>
							<div className={`bg-white h-0.5 w-6 mb-1 transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
							<div
								className={`bg-white h-0.5 w-6 transition-all duration-300 ${
									isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
								}`}
							/>
						</div>
					</button>
				</div>
			</div>

			{/* Mobile Menu Overlay */}
			<div
				className={`fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center transition-opacity duration-300 ${
					isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
				} lg:hidden`}
			>
				<div className="flex flex-col items-center gap-6 text-white">{renderNavLinks(true)}</div>
			</div>
		</>
	);
};

export default Navbar;
