import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { KnowledgeLevel, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
	try {
		const authHeader = req.headers.get("authorization");
		if (!authHeader) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const token = authHeader.split(" ")[1];
		const secret = process.env.JWT_SECRET;
		if (!secret) {
			return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
		}

		let decoded: any;
		try {
			decoded = jwt.verify(token, secret);
		} catch (err) {
			return NextResponse.json({ error: "Invalid token" }, { status: 401 });
		}

		const { score } = await req.json();
		let level: KnowledgeLevel = KnowledgeLevel.BEGINNER;
		if (score >= 3 && score < 4) {
			level = KnowledgeLevel.INTERMEDIATE;
		} else if (score >= 4) {
			level = KnowledgeLevel.ADVANCED;
		}

		await prisma.user.update({
			where: { email: decoded.email },
			data: { level },
		});

		return NextResponse.json({ message: "Level updated successfully" });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
