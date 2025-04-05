"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/store";
import { Award, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ResultsScreenProps {
	score: number;
	totalQuestions: number;
	onRestartAction: () => void;
}

export function ResultsScreen({ score, totalQuestions, onRestartAction }: ResultsScreenProps) {
	const percentage = Math.round((score / totalQuestions) * 100);
	const router = useRouter();
	const { jwt } = useAuth();

	async function assignLevel() {
		const resp = await fetch("/api/assign-level", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${jwt}`,
			},
			body: JSON.stringify({
				score,
			}),
		});
		if (!resp.ok) {
			console.error("Failed to assign level");
			toast.error("Failed to assign level");
		} else {
			toast.success("Level assigned successfully");
			setTimeout(() => {
				window.location.reload();
			}, 500);
		}
	}

	useEffect(() => {
		assignLevel();
	}, [score]);

	let message = "";
	if (percentage >= 80) {
		message = "Excellent! You're a finance expert!";
	} else if (percentage >= 60) {
		message = "Good job! You know your finance basics.";
	} else if (percentage >= 40) {
		message = "Not bad! Keep learning about finance.";
	} else {
		message = "Keep studying! Finance knowledge takes time.";
	}

	return (
		<div className="text-center py-8">
			<div className="flex justify-center mb-6">
				<div className="bg-primary/10 p-4 rounded-full">
					<Award className="h-12 w-12 text-primary" />
				</div>
			</div>

			<h2 className="text-xl font-semibold mb-2">Quiz Completed!</h2>
			<p className="text-muted-foreground mb-6">{message}</p>

			<div className="bg-muted p-6 rounded-lg mb-8">
				<div className="text-4xl font-bold mb-2">
					{score} / {totalQuestions}
				</div>
				<div className="text-lg text-muted-foreground">{percentage}% Score</div>
			</div>

			<Button onClick={onRestartAction} className="gap-2">
				<RotateCcw className="h-4 w-4" />
				Take Quiz Again
			</Button>
		</div>
	);
}
