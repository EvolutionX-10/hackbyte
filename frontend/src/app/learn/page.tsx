"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/store";
import Auth from "@/lib/auth";
import { KnowledgeLevel } from "@prisma/client";
import { QuizApp } from "@/components/quiz";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LearningTrackComponent } from "@/components/learning-track";
import { LearningTrack, generateLearningTrack } from "@/lib/ai";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FinanceTopics } from "@/lib/ai-config";
import { TopicSelector } from "@/components/topic-selector";

export default function LearnPage() {
	const { jwt } = useAuth();
	const router = useRouter();
	const [knowledge, setKnowledge] = useState<KnowledgeLevel | null>();
	const [loading, setLoading] = useState(true);
	const [learningTrack, setLearningTrack] = useState<LearningTrack | null>(null);
	const [selectedTopic, setSelectedTopic] = useState<FinanceTopics | null>(null);
	const [showTopicSelector, setShowTopicSelector] = useState(false);
	const [progress, setProgress] = useState(0);
	const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const loadingStageRef = useRef<string>("initial");

	// Function to start the continuous progress animation
	const startProgressAnimation = (initialValue: number, targetValue: number, duration: number, stage: string) => {
		// Clear any existing interval
		if (progressIntervalRef.current) {
			clearInterval(progressIntervalRef.current);
		}

		loadingStageRef.current = stage;
		setProgress(initialValue);

		// Calculate interval steps
		const steps = 100; // Number of steps to take
		const increment = (targetValue - initialValue) / steps;
		const intervalTime = duration / steps;

		let currentProgress = initialValue;

		progressIntervalRef.current = setInterval(() => {
			// Only continue the animation if we're still in the same loading stage
			if (loadingStageRef.current === stage) {
				currentProgress += increment;

				// Ensure we don't exceed the target
				if (currentProgress >= targetValue) {
					currentProgress = targetValue;
					if (progressIntervalRef.current) {
						clearInterval(progressIntervalRef.current);
						progressIntervalRef.current = null;
					}
				}

				setProgress(currentProgress);
			} else {
				// If the stage changed, clear the interval
				if (progressIntervalRef.current) {
					clearInterval(progressIntervalRef.current);
					progressIntervalRef.current = null;
				}
			}
		}, intervalTime);
	};

	// Clean up interval on unmount
	useEffect(() => {
		return () => {
			if (progressIntervalRef.current) {
				clearInterval(progressIntervalRef.current);
			}
		};
	}, []);

	async function getUser() {
		try {
			// Start the initial loading animation (0% to 15%)
			startProgressAnimation(0, 15, 1000, "user-fetch");

			const userData = await Auth.getUser(jwt);
			if (!userData.success) {
				router.push("/login");
				toast("Please log in to continue");
				return;
			}

			// Smoothly transition from 15% to 20%
			startProgressAnimation(15, 20, 500, "knowledge-set");
			setKnowledge(userData.user.level);

			// If user has a knowledge level, fetch personalized learning track
			if (userData.user.level) {
				// Move to next stage of loading (20% to 30%)
				startProgressAnimation(20, 30, 800, "prepare-fetch");
				await fetchLearningTrack(userData.user.level);
			}
		} catch (error) {
			console.error("Error getting user data:", error);
			toast.error("Error loading user data");
		} finally {
			setLoading(false);
		}
	}

	async function fetchLearningTrack(level: KnowledgeLevel, topic?: FinanceTopics) {
		try {
			setLoading(true);
			setShowTopicSelector(false);

			// Start loading animation (0% to 30%)
			startProgressAnimation(0, 30, 1500, "prepare-content");

			// Show indeterminate progress that slowly increases while waiting for AI
			setTimeout(() => {
				if (loadingStageRef.current === "prepare-content") {
					startProgressAnimation(30, 70, 8000, "generating-content");
				}
			}, 1500);

			// Generate learning track content based on user level and optional topic
			const track = await generateLearningTrack(level, topic);

			// Smoothly finish the loading animation (current % to 100%)
			const currentValue = loadingStageRef.current === "generating-content" ? Math.min(progress, 70) : 30;

			startProgressAnimation(currentValue, 100, 800, "complete");

			// Short delay before finishing to show complete progress
			await new Promise((resolve) => setTimeout(resolve, 800));

			setLearningTrack(track);
			setSelectedTopic(topic || null);
		} catch (error) {
			console.error("Error generating learning track:", error);
			toast.error("Failed to load learning content");
		} finally {
			setLoading(false);
		}
	}

	function handleTrackComplete() {
		toast.success("Congratulations! You've completed this learning track. 🎉");
	}

	function handleTopicChange(topic: FinanceTopics | undefined) {
		if (knowledge) {
			fetchLearningTrack(knowledge, topic);
		}
	}

	useEffect(() => {
		getUser();
	}, []);

	if (loading) {
		// Generate loading message based on the current stage
		let loadingMessage = "Personalizing content based on your knowledge level...";

		if (loadingStageRef.current === "generating-content") {
			loadingMessage = "Generating personalized finance learning content...";
		} else if (loadingStageRef.current === "complete") {
			loadingMessage = "Finalizing your learning materials...";
		}

		return (
			<main className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
				<Card className="w-full max-w-3xl">
					<CardHeader>
						<CardTitle>Loading Your Finance Learning Track</CardTitle>
						<CardDescription>{loadingMessage}</CardDescription>
					</CardHeader>
					<CardContent>
						<Progress value={progress} className="h-2 w-full my-2" />
						<p className="text-xs text-muted-foreground text-right mt-1">{Math.round(progress)}%</p>
					</CardContent>
				</Card>
			</main>
		);
	}

	if (knowledge === undefined) {
		return (
			<main className="min-h-screen flex items-center justify-center p-4 bg-background">
				<h1 className="text-4xl">Loading...</h1>
			</main>
		);
	}

	if (knowledge === null) {
		return (
			<main className="min-h-screen flex items-center justify-center p-4 bg-background">
				<div className="w-full max-w-3xl">
					<QuizApp />
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen container py-8 bg-background">
			<div className="max-w-4xl mx-auto">
				<div className="space-y-8">
					<div className="flex flex-wrap justify-between items-center">
						<div>
							<h1 className="text-3xl font-bold mb-2">Your Learning Journey</h1>
							<p className="text-muted-foreground">
								Customized finance education for your {knowledge.toLowerCase()} level
								{selectedTopic && ` - ${selectedTopic}`}
							</p>
						</div>

						<div className="flex gap-3 mt-2 sm:mt-0">
							<Button variant="outline" onClick={() => setShowTopicSelector(!showTopicSelector)}>
								{showTopicSelector ? "Hide Topics" : "Change Topic"}
							</Button>

							<Button variant="secondary" onClick={() => fetchLearningTrack(knowledge, selectedTopic || undefined)}>
								Refresh Content
							</Button>
						</div>
					</div>

					{showTopicSelector && <TopicSelector selectedTopic={selectedTopic} onSelect={handleTopicChange} />}

					{learningTrack ? (
						<LearningTrackComponent track={learningTrack} level={knowledge} onComplete={handleTrackComplete} />
					) : (
						<div className="text-center p-12 border rounded-md">
							<h2 className="text-xl mb-4">Failed to load learning content</h2>
							<Button onClick={() => fetchLearningTrack(knowledge, selectedTopic || undefined)}>Try Again</Button>
						</div>
					)}
				</div>
			</div>
		</main>
	);
}
