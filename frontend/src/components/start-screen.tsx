"use client";

import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

interface StartScreenProps {
	onStartAction: () => void;
}

export function StartScreen({ onStartAction }: StartScreenProps) {
	return (
		<div className="text-center py-8 text-gray-100">
			<div className="flex justify-center mb-6">
				<div className="bg-lime-400/20 p-4 rounded-full">
					<BookOpen className="h-12 w-12 text-lime-400" />
				</div>
			</div>

			<h2 className="text-xl font-semibold mb-4">Welcome to the Finance Quiz</h2>
			<p className="text-gray-400 mb-8">
				Test your knowledge of finance and stock markets with this 5-question quiz. Are you ready to challenge yourself?
			</p>

			<Button size="lg" onClick={onStartAction} className="bg-lime-500 hover:bg-lime-600 text-white">
				Start Quiz
			</Button>
		</div>
	);
}