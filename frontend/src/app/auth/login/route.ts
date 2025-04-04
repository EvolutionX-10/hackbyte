import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

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
		if (!isPasswordValid) {
			return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
		}

		return NextResponse.json({ success: true, message: "Login successful" });
	} catch (error) {
		return NextResponse.json({ success: false, message: "An error occurred" }, { status: 500 });
	}
}
