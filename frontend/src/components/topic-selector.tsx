import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FinanceTopics } from "@/lib/ai-config";

interface TopicSelectorProps {
	selectedTopic: FinanceTopics | null;
	onSelect: (topic: FinanceTopics | undefined) => void;
}

export function TopicSelector({ selectedTopic, onSelect }: TopicSelectorProps) {
	return (
		<Card className="bg-[#1c1d23] border-gray-700">
			<CardContent className="pt-6">
				<div className="space-y-4">
					<div className="flex flex-wrap items-center justify-between">
						<h3 className="text-lg font-medium text-gray-100">Choose a Learning Topic</h3>
						{selectedTopic && (
							<button
								onClick={() => onSelect(undefined)}
								className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
							>
								Clear selection
							</button>
						)}
					</div>

					<RadioGroup
						value={selectedTopic || ""}
						onValueChange={(value) => {
							onSelect(value ? (value as FinanceTopics) : undefined);
						}}
						className="grid grid-cols-1 md:grid-cols-2 gap-4"
					>
						{Object.values(FinanceTopics).map((topic) => (
							<div
								key={topic}
								className={`flex items-center space-x-2 border rounded-lg p-4 cursor-pointer ${
									selectedTopic === topic
										? "border-blue-500 bg-blue-500/20"
										: "border-gray-700 hover:bg-gray-800"
								}`}
								onClick={() => onSelect(topic)}
							>
								<RadioGroupItem value={topic} id={`topic-${topic}`} />
								<Label htmlFor={`topic-${topic}`} className="w-full cursor-pointer">
									{topic}
								</Label>
							</div>
						))}
					</RadioGroup>
				</div>
			</CardContent>
		</Card>
	);
}
