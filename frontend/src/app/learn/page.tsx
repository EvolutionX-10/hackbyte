"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/store";
import Auth from "@/lib/auth";
import { KnowledgeLevel } from "@prisma/client";
import { QuizApp } from "@/components/quiz";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LearnPage() {
	const { jwt } = useAuth();
	const router = useRouter();
	const [knowledge, setKnowledge] = useState<KnowledgeLevel | null>();

	async function getUser() {
		const userData = await Auth.getUser(jwt);
		if (!userData.success) {
			router.push("/login");
			toast("Please log in to continue");
			return;
		}
		setKnowledge(userData.user.level);
	}

	useEffect(() => {
		getUser();
	}, []);

	if (knowledge === undefined) {
		return (
			<main className="h-screen w-screen flex items-center justify-center">
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

	return <div>YEEEEEE</div>;
}
