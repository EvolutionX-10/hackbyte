import { createGoogleGenerativeAI } from "@ai-sdk/google";

// Initialize the Google Generative AI client with the API key
export const genAI = createGoogleGenerativeAI();

// Helper function to create a model instance with optional custom configuration
export function createModel(customConfig = {}) {
	return genAI("gemini-2.5-pro-exp-03-25", {
		...customConfig,
	});
}

// Define types for the learning content system
export enum FinanceTopics {
	INVESTING_BASICS = "Investing Basics",
	STOCK_MARKET = "Stock Market",
	PORTFOLIO_MANAGEMENT = "Portfolio Management",
	RISK_ASSESSMENT = "Risk Assessment",
	FINANCIAL_ANALYSIS = "Financial Analysis",
	ADVANCED_TRADING = "Advanced Trading Strategies",
}

// Learning progress tracking type
export type LearningProgress = {
	userId: string;
	trackId: string;
	completedSections: string[];
	quizScores: Record<string, number>; // sectionId -> score
	lastAccessedAt: Date;
};
