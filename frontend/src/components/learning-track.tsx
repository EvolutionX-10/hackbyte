import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LearningTrack } from "@/lib/ai";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { KnowledgeLevel } from "@prisma/client";

type LearningTrackProps = {
	track: LearningTrack;
	level: KnowledgeLevel;
	onComplete?: () => void;
};

export function LearningTrackComponent({ track, level, onComplete }: LearningTrackProps) {
	const [activeSection, setActiveSection] = useState(0);
	const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
	const [showResults, setShowResults] = useState(false);
	const [completedSections, setCompletedSections] = useState<number[]>([]);
	const [activeTab, setActiveTab] = useState<string>("content");

	const progressPercentage = Math.round((completedSections.length / track.sections.length) * 100);

	useEffect(() => {
		// Load saved progress from local storage
		const savedProgress = localStorage.getItem(`learning-progress-${level}`);
		if (savedProgress) {
			try {
				const { sections, answers } = JSON.parse(savedProgress);
				setCompletedSections(sections);
				setQuizAnswers(answers);
			} catch (e) {
				console.error("Failed to load learning progress", e);
			}
		}
	}, [level]);

	useEffect(() => {
		// Save progress to local storage when completed sections change
		if (completedSections.length > 0) {
			localStorage.setItem(
				`learning-progress-${level}`,
				JSON.stringify({
					sections: completedSections,
					answers: quizAnswers,
					lastUpdated: new Date().toISOString(),
				}),
			);

			// Check if all sections are completed
			if (completedSections.length === track.sections.length && onComplete) {
				onComplete();
			}
		}
	}, [completedSections, quizAnswers, level, track.sections.length, onComplete]);

	const handleNextSection = () => {
		// Mark current section as completed if it hasn't been already
		if (!completedSections.includes(activeSection)) {
			setCompletedSections([...completedSections, activeSection]);
		}

		if (activeSection < track.sections.length - 1) {
			setActiveSection(activeSection + 1);
			setShowResults(false);
			setActiveTab("content");
		}
	};

	const handlePreviousSection = () => {
		if (activeSection > 0) {
			setActiveSection(activeSection - 1);
			setShowResults(false);
			setActiveTab("content");
		}
	};

	const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
		setQuizAnswers({
			...quizAnswers,
			[`${activeSection}-${questionIndex}`]: answerIndex,
		});
	};

	const handleCheckAnswers = () => {
		setShowResults(true);
		const currentSection = track.sections[activeSection];
		if (!currentSection.quiz) return;

		let correct = 0;
		let total = currentSection.quiz.length;

		currentSection.quiz.forEach((quizItem, index) => {
			const userAnswer = quizAnswers[`${activeSection}-${index}`];
			if (userAnswer === quizItem.answerIndex) {
				correct++;
			}
		});

		if (correct === total) {
			toast.success(`Great job! You got all ${total} questions correct!`);

			// Mark current section as completed if it hasn't been already
			if (!completedSections.includes(activeSection)) {
				setCompletedSections([...completedSections, activeSection]);
			}
		} else {
			toast(`You got ${correct} out of ${total} correct. Keep learning!`);
		}
	};

	const currentSection = track.sections[activeSection];

	const renderDifficultyBadge = () => {
		switch (level) {
			case KnowledgeLevel.BEGINNER:
				return <Badge variant="secondary">Beginner</Badge>;
			case KnowledgeLevel.INTERMEDIATE:
				return <Badge variant="outline">Intermediate</Badge>;
			case KnowledgeLevel.ADVANCED:
				return <Badge variant="default">Advanced</Badge>;
			default:
				return null;
		}
	};

	return (
		<div className="space-y-8">
			<div className="flex justify-between items-center">
				<div className="space-y-1">
					<h2 className="text-2xl font-bold">{track.title}</h2>
					<div className="flex items-center gap-2">
						{renderDifficultyBadge()}
						<span className="text-sm text-muted-foreground">
							{completedSections.length} of {track.sections.length} sections completed
						</span>
					</div>
				</div>

				<div className="w-1/3">
					<Progress value={progressPercentage} className="h-2" />
				</div>
			</div>

			<Card>
				<CardHeader>
					<div className="flex justify-between items-center">
						<div>
							<CardTitle className="text-xl">{currentSection.title}</CardTitle>
							<CardDescription>
								Section {activeSection + 1} of {track.sections.length}
							</CardDescription>
						</div>
						{completedSections.includes(activeSection) && (
							<Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
								Completed
							</Badge>
						)}
					</div>
				</CardHeader>

				<CardContent>
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList className="mb-4">
							<TabsTrigger value="content">Learn</TabsTrigger>
							{currentSection.quiz && currentSection.quiz.length > 0 && (
								<TabsTrigger value="quiz">
									Quiz
									{showResults && quizAnswers[`${activeSection}-0`] !== undefined && (
										<span className="ml-2 w-2 h-2 rounded-full bg-green-500"></span>
									)}
								</TabsTrigger>
							)}
						</TabsList>

						<TabsContent value="content">
							<div className="space-y-4">
								<div className="prose dark:prose-invert max-w-none">
									{/* Use dangerouslySetInnerHTML to render markdown content */}
									<div
										dangerouslySetInnerHTML={{
											__html: currentSection.content
												.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
												.replace(/\*(.*?)\*/g, "<em>$1</em>")
												.replace(/\n/g, "<br />"),
										}}
									/>
								</div>
							</div>
						</TabsContent>

						{currentSection.quiz && currentSection.quiz.length > 0 && (
							<TabsContent value="quiz" className="space-y-6">
								{currentSection.quiz.map((quizItem, questionIndex) => (
									<div key={questionIndex} className="space-y-4">
										<h3 className="text-lg font-medium">{quizItem.question}</h3>

										<RadioGroup
											value={quizAnswers[`${activeSection}-${questionIndex}`]?.toString()}
											onValueChange={(value) => handleAnswerSelect(questionIndex, parseInt(value))}
										>
											{quizItem.options.map((option, optionIndex) => (
												<div
													key={optionIndex}
													className={`flex items-center space-x-2 p-3 border rounded-md ${
														showResults
															? optionIndex === quizItem.answerIndex
																? "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-800"
																: quizAnswers[`${activeSection}-${questionIndex}`] === optionIndex
																? "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-800"
																: "border-gray-200 dark:border-gray-800"
															: "border-gray-200 dark:border-gray-800"
													} transition-colors`}
												>
													<RadioGroupItem value={optionIndex.toString()} id={`q${questionIndex}-a${optionIndex}`} />
													<Label htmlFor={`q${questionIndex}-a${optionIndex}`} className="w-full cursor-pointer">
														{option}
													</Label>
													{showResults && optionIndex === quizItem.answerIndex && (
														<span className="text-green-600 dark:text-green-400 text-sm ml-2">Correct answer</span>
													)}
												</div>
											))}
										</RadioGroup>
									</div>
								))}

								<Button onClick={handleCheckAnswers} disabled={showResults} className="mt-4">
									Check Answers
								</Button>
							</TabsContent>
						)}
					</Tabs>
				</CardContent>

				<CardFooter className="flex justify-between border-t pt-4">
					<Button variant="outline" onClick={handlePreviousSection} disabled={activeSection === 0}>
						Previous
					</Button>

					<div className="flex gap-2">
						{activeTab === "content" && currentSection.quiz && (
							<Button variant="secondary" onClick={() => setActiveTab("quiz")}>
								Take Quiz
							</Button>
						)}

						<Button onClick={handleNextSection} disabled={activeSection === track.sections.length - 1}>
							Next Section
						</Button>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
