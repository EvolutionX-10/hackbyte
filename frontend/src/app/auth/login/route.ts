import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { sign } from "jsonwebtoken";

export async function POST(request: Request) {
	const prisma = new PrismaClient();
	try {
		const { email, password } = await request.json();

		const user = await prisma.user.findUnique({
			where: { email },
		});
		if (!user) {
			return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		const hashedPassword = await bcrypt.hash(password, 10);

		if (!isPasswordValid) {
			return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
		}

		const jwt = sign(
			{
				email,
				password: hashedPassword,
			},
			process.env.JWT_SECRET!,
		);

		return NextResponse.json({ success: true, message: "Login successful", token: jwt }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ success: false, message: "An error occurred" }, { status: 500 });
	}
}
