"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StartScreen } from "@/components/start-screen";
import { QuestionScreen } from "@/components/question-screen";
import { ResultsScreen } from "@/components/results-screen";

const questions = [
	{
		id: 1,
		question: "What is an ETF in the context of investing?",
		options: ["Equity Transfer Fund", "Exchange-Traded Fund", "Electronic Trading Facility", "Equity Trading Formula"],
		correctAnswer: "Exchange-Traded Fund",
	},
	{
		id: 2,
		question: "Which financial metric is commonly used to assess if a stock is overvalued or undervalued?",
		options: ["Beta coefficient", "Current ratio", "Price-to-Earnings (P/E) ratio", "Dividend yield"],
		correctAnswer: "Price-to-Earnings (P/E) ratio",
	},
	{
		id: 3,
		question: "What is the main purpose of a stop-loss order in trading?",
		options: [
			"To maximize gains",
			"To reduce brokerage fees",
			"To limit potential losses",
			"To increase dividend payouts",
		],
		correctAnswer: "To limit potential losses",
	},
	{
		id: 4,
		question: "What does the Sharpe Ratio evaluate in an investment portfolio?",
		options: [
			"Total returns compared to industry average",
			"Risk-adjusted return",
			"Dividend consistency",
			"Market correlation",
		],
		correctAnswer: "Risk-adjusted return",
	},
	{
		id: 5,
		question: "In options trading, when is a call option considered 'in the money'?",
		options: [
			"When the stock price is above the strike price",
			"When the stock price is below the strike price",
			"When the option is close to expiration",
			"When volatility is low",
		],
		correctAnswer: "When the stock price is above the strike price",
	},
];

type QuizState = "start" | "question" | "results";

export function QuizApp() {
	const [quizState, setQuizState] = useState<QuizState>("start");
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [score, setScore] = useState(0);
	const [answers, setAnswers] = useState<string[]>([]);

	const startQuiz = () => {
		setQuizState("question");
		setCurrentQuestionIndex(0);
		setScore(0);
		setAnswers([]);
	};

	const handleAnswer = (selectedAnswer: string) => {
		const currentQuestion = questions[currentQuestionIndex];
		const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

		if (isCorrect) {
			setScore(score + 1);
		}

		setAnswers([...answers, selectedAnswer]);

		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		} else {
			setQuizState("results");
		}
	};

	const restartQuiz = () => {
		setQuizState("start");
	};

	return (
		<Card className="shadow-lg">
			<CardHeader className="text-center">
				<CardTitle className="text-2xl font-bold text-primary">Finance Quiz</CardTitle>
				<CardDescription>Test your knowledge of finance and stock markets</CardDescription>
			</CardHeader>

			<CardContent>
				{quizState === "start" && <StartScreen onStartAction={startQuiz} />}

				{quizState === "question" && (
					<>
						<div className="mb-4">
							<div className="flex justify-between text-sm text-muted-foreground mb-2">
								<span>
									Question {currentQuestionIndex + 1} of {questions.length}
								</span>
							</div>
							<Progress value={((currentQuestionIndex + 1) / questions.length) * 100} />
						</div>

						<QuestionScreen question={questions[currentQuestionIndex]} onAnswerAction={handleAnswer} />
					</>
				)}

				{quizState === "results" && (
					<ResultsScreen score={score} totalQuestions={questions.length} onRestartAction={restartQuiz} />
				)}
			</CardContent>

			{quizState !== "start" && quizState !== "results" && (
				<CardFooter className="flex justify-between">
					<div className="text-sm text-muted-foreground">
						{currentQuestionIndex + 1} of {questions.length}
					</div>
				</CardFooter>
			)}
		</Card>
	);
}
