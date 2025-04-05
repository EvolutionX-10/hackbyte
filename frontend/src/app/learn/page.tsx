"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/store";
import Auth from "@/lib/auth";
import { KnowledgeLevel } from "@prisma/client";

export default function LearnPage() {
	const { jwt } = useAuth();
	const [knowledge, setKnowledge] = useState<KnowledgeLevel | null>();

	async function getUser() {
		const userData = await Auth.getUser(jwt);
		setKnowledge(userData.user.level);
	}

	useEffect(() => {
		getUser();
	}, []);

	if (knowledge === undefined) {
		return <h1>Loading...</h1>; // @iceXshadow to add Loader
	}

	if (knowledge === null) {
		return <h1>You Know NOTHING</h1>;
	}

	return <div>YEEEEEE</div>;
}
