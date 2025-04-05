import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { sign } from "jsonwebtoken";

export async function POST(request: Request) {
	const prisma = new PrismaClient();
	try {
		const { email, password } = await request.json();

		const existingUser = await prisma.user.findUnique({
			where: { email },
		});
		if (existingUser) {
			return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		await prisma.user.create({
			data: { email, password: hashedPassword },
		});

		const jwt = sign({ email, password: hashedPassword }, process.env.JWT_SECRET!);

		return NextResponse.json({ success: true, message: "User registered successfully", token: jwt }, { status: 201 });
	} catch (error) {
		return NextResponse.json({ success: false, message: "An error occurred" }, { status: 500 });
	}
}
