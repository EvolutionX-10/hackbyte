import { KnowledgeLevel } from "@prisma/client";
import { ContentLanguage, FinanceTopics } from "./ai-config";

export type LearningTrack = {
	title: string;
	description: string;
	sections: LearningSection[];
};

export type LearningSection = {
	title: string;
	content: string;
	quiz?: {
		question: string;
		options: string[];
		answerIndex: number;
	}[];
};

export async function generateLearningTrack(
	level: KnowledgeLevel,
	topic?: FinanceTopics,
	language: ContentLanguage = ContentLanguage.ENGLISH
): Promise<LearningTrack> {
	try {
		const response = await fetch("/api/generate-learning", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ level, topic, language }),
		});

		if (!response.ok) {
			throw new Error(`Failed to generate content: ${response.statusText}`);
		}

		const result = await response.json();

		if (!result.success) {
			throw new Error(result.error || "Failed to generate content");
		}

		return result.data as LearningTrack;
	} catch (error) {
		console.error("Error in generateLearningTrack:", error);
		return {
			title: `Default ${level} Finance Track`,
			description: "Sorry, we couldn't generate custom content at this time. Here's some default material.",
			sections: [
				{
					title: "Introduction to Finance",
					content: "Finance is the study of money management and the process of acquiring needed funds.",
					quiz: [
						{
							question: "What is finance primarily concerned with?",
							options: ["Social media", "Money management", "Sports", "History"],
							answerIndex: 1,
						},
					],
				},
			],
		};
	}
}
