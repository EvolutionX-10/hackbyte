"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Question {
	id: number;
	question: string;
	options: string[];
	correctAnswer: string;
}

interface QuestionScreenProps {
	question: Question;
	onAnswerAction: (answer: string) => void;
}

export function QuestionScreen({ question, onAnswerAction }: QuestionScreenProps) {
	const [selectedOption, setSelectedOption] = useState<string | null>(null);

	const handleSubmit = () => {
		if (selectedOption) {
			onAnswerAction(selectedOption);
			setSelectedOption(null);
		}
	};

	return (
		<div className="py-4">
			<h3 className="text-lg font-medium mb-6 text-gray-100">{question.question}</h3>

			<RadioGroup className="space-y-4 mb-6" value={selectedOption || ""} onValueChange={setSelectedOption}>
				{question.options.map((option, index) => (
					<div
						key={index}
						className="flex items-center space-x-2 border border-gray-700 px-4 rounded-md hover:bg-slate-50/10 transition-colors"
					>
						<RadioGroupItem value={option} id={`option-${index}`} className="text-lime-400" />
						<Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer py-4 text-gray-200">
							{option}
						</Label>
					</div>
				))}
			</RadioGroup>

			<Button 
				className="w-full mt-4 bg-lime-500 hover:bg-lime-600 text-white disabled:bg-gray-700 disabled:text-gray-400" 
				onClick={handleSubmit} 
				disabled={!selectedOption}
			>
				Submit Answer
			</Button>
		</div>
	);
}