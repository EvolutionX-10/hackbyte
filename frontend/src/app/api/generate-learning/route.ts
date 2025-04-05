import { KnowledgeLevel } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { createModel, FinanceTopics } from "@/lib/ai-config";
import { generateText } from "ai";
import { generateLevelSpecificPrompt } from "@/lib/prompt-templates";

export async function POST(request: NextRequest) {
	try {
		// Validate request with proper authorization (should check JWT in production)
		const body = await request.json();
		const { level, topic } = body;

		if (!level || !Object.values(KnowledgeLevel).includes(level)) {
			return NextResponse.json({ error: "Invalid or missing knowledge level" }, { status: 400 });
		}

		// Generate learning content based on user's knowledge level
		const learningTrack = await generateLearningTrack(level as KnowledgeLevel, topic);

		return NextResponse.json({ success: true, data: learningTrack });
	} catch (error) {
		console.error("Error generating learning content:", error);
		return NextResponse.json({ error: "Failed to generate learning content" }, { status: 500 });
	}
}

async function generateLearningTrack(level: KnowledgeLevel, topic?: string) {
	// Configure model settings based on knowledge level
	const modelConfig = {
		// Less creativity for beginners for clearer explanations
		temperature: level === KnowledgeLevel.BEGINNER ? 0.5 : level === KnowledgeLevel.INTERMEDIATE ? 0.65 : 0.75,
		maxOutputTokens: 4096, // Allow more detailed content
	};

	const model = createModel();

	// Generate specialized prompt based on user level and optional topic
	const prompt = generateLevelSpecificPrompt(level, topic as FinanceTopics);

	try {
		const { text } = await generateText({
			model,
			prompt,
			maxTokens: 4096,
			temperature: modelConfig.temperature,
		});

		// Extract JSON from response (in case there's additional text)
		const jsonMatch = text.match(/\{[\s\S]*\}/);
		if (!jsonMatch) {
			throw new Error("Failed to parse AI response");
		}

		return JSON.parse(jsonMatch[0]);
	} catch (error) {
		console.error("Error generating learning track:", error);

		// Return a default learning track if generation fails
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
