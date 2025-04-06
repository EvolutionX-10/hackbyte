"use client";

import React, { useState, useEffect } from "react";
import { BorderBeam } from "../magicui/border-beam";
import { TypingAnimation } from "../magicui/typing-animation";

const Hero: React.FC = () => {
	const [animateNumber, setAnimateNumber] = useState(0);
	const targetNumber = 10000;

	// Number animation effect
	useEffect(() => {
		const interval = setInterval(() => {
			setAnimateNumber((prev) => {
				const nextValue = prev + Math.ceil(targetNumber / 50);
				return nextValue >= targetNumber ? targetNumber : nextValue;
			});
		}, 30);

		return () => clearInterval(interval);
	}, []);

	return (
		<section className="w-full py-12 sm:min-h-screen flex items-center justify-center">
			<div className="container px-4 flex flex-col items-center mx-auto space-y-12 md:space-y-16">
				<div className="relative overflow-hidden max-w-xs sm:max-w-sm rounded-full">
					<div className="flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-7 py-2 rounded-full border border-lime-50/50 text-base sm:text-xl font-semibold">
						<div className="flex items-center gap-2 sm:gap-3">
							<span>simulate</span>
							<span>•</span>
							<span>trade</span>
							<span>•</span>
							<span>learn</span>
						</div>
					</div>
					<BorderBeam duration={6} size={80} className="from-transparent via-lime-500 to-transparent" />
				</div>

				<div className="text-center">
					<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-6">
						Because finance shouldn&apos;t feel like 
						<TypingAnimation 
							className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold">
								rocket science.
						</TypingAnimation>
					</h1>

					<p className="text-lg sm:text-xl text-gray-300 max-w-xl mx-auto mb-8 transition-opacity duration-500">
						Master investing through interactive guides
					</p>
				</div>

				<div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
					<button className="px-8 py-4 bg-lime-500 rounded-lg text-black font-bold hover:bg-lime-400 transition-colors duration-300 w-full sm:w-auto">
						Get Started
					</button>
					<div className="flex items-center gap-2 text-xl font-semibold">
						<span className="text-lime-400">{animateNumber.toLocaleString()}</span>
						<span className="text-gray-400">investors joined</span>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
