import { KnowledgeLevel } from "@prisma/client";
import { FinanceTopics } from "./ai-config";

// Base prompt structure for all knowledge levels
const basePrompt = `
Generate a structured finance learning track that is informative, educational and engaging.

The track should include the following:
1. A catchy title for the learning track
2. A brief description (2-3 sentences) explaining what the user will learn
3. 3-5 sections of learning content, each with:
   - Clear section title
   - Educational content about finance/stock markets (with some markdown formatting)
   - Real world examples or analogies to illustrate concepts
   - 1-3 quiz questions with 4 options each and the correct answer index (0-3)

Format the response as a valid JSON object with this exact structure:
{
  "title": "Title of Learning Track",
  "description": "Brief description of what the user will learn",
  "sections": [
    {
      "title": "Section Title",
      "content": "Educational content with markdown",
      "quiz": [
        {
          "question": "Quiz question text?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "answerIndex": 0
        }
      ]
    }
  ]
}
`;

// Level-specific prompt additions
const levelSpecificPrompts: Record<KnowledgeLevel, string> = {
	[KnowledgeLevel.BEGINNER]: `
Focus on fundamental concepts and basic terminology that would be suitable for complete beginners.
Content should:
- Explain basic financial terms and concepts in simple language
- Use everyday analogies to explain complex ideas
- Avoid industry jargon or explain it thoroughly when used
- Include very basic concepts about investing, saving, and financial markets
- Cover topics like what stocks are, how markets work, basic investment approaches

The overall difficulty level should be appropriate for someone with NO prior finance knowledge.
  `,

	[KnowledgeLevel.INTERMEDIATE]: `
Build on fundamental concepts and introduce moderately complex strategies and analysis techniques.
Content should:
- Assume basic knowledge of financial markets and investment vehicles
- Introduce more technical concepts and strategies
- Explain intermediate concepts like portfolio diversification, asset allocation, and risk assessment
- Include some industry terminology with brief explanations
- Cover topics like fundamental analysis, technical indicators, and investment strategies
- Introduce concepts like P/E ratios, market cycles, and economic indicators

The overall difficulty level should be appropriate for someone with SOME finance knowledge who understands basic concepts.
  `,

	[KnowledgeLevel.ADVANCED]: `
Focus on sophisticated investment strategies, complex market analysis, and advanced concepts.
Content should:
- Assume solid understanding of financial markets, investment vehicles, and economics
- Discuss advanced concepts and strategies in detail
- Include complex topics like options strategies, derivatives, hedging techniques, and alternative investments
- Use technical language and industry terminology freely
- Cover topics like advanced portfolio theory, factor investing, macroeconomic analysis
- Discuss complex topics like volatility strategies, statistical arbitrage, or sector rotation tactics

The overall difficulty level should be challenging and appropriate for experienced investors with SIGNIFICANT finance knowledge.
  `,
};

// Topic-specific prompt additions for further customization
const topicSpecificPrompts: Record<FinanceTopics, string> = {
	[FinanceTopics.INVESTING_BASICS]: `
Focus on core investing concepts and fundamentals that build a strong foundation.
  `,
	[FinanceTopics.STOCK_MARKET]: `
Focus specifically on stock market mechanics, analysis techniques, and trading strategies.
  `,
	[FinanceTopics.PORTFOLIO_MANAGEMENT]: `
Focus on building, optimizing, and managing investment portfolios for different objectives.
  `,
	[FinanceTopics.RISK_ASSESSMENT]: `
Focus on understanding, measuring, and mitigating various financial risks in investing.
  `,
	[FinanceTopics.FINANCIAL_ANALYSIS]: `
Focus on analyzing financial statements, metrics, and indicators to evaluate investments.
  `,
	[FinanceTopics.ADVANCED_TRADING]: `
Focus on sophisticated trading strategies, technical analysis, and market timing techniques.
  `,
};

/**
 * Generates a specialized prompt for learning content based on user level and optional topic
 */
export function generateLevelSpecificPrompt(level: KnowledgeLevel, topic?: FinanceTopics): string {
	let prompt = basePrompt + levelSpecificPrompts[level];

	if (topic) {
		prompt += topicSpecificPrompts[topic];
	}

	return prompt;
}
