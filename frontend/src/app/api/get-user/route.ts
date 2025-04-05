import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";

export async function POST(request: NextRequest) {
	const { token } = await request.json();
	if (!token) {
		return NextResponse.json(
			{
				success: false,
				message: "Token is required",
			},
			{
				status: 401,
			},
		);
	}
	const prisma = new PrismaClient();
	const resp = verify(token, process.env.JWT_SECRET!, async function (err: unknown, decode: unknown) {
		if (err instanceof Error) {
			return NextResponse.json(
				{
					success: false,
					message: "Invalid token",
					error: err.message,
				},
				{
					status: 401,
				},
			);
		}

		const user = decode as { iat: number; email: string; password: string };
		const userFromDb = (await prisma.user.findUnique({
			where: {
				email: user.email,
			},
		})) as Partial<User>;

		delete userFromDb.password; // Remove password from the user object

		return NextResponse.json(
			{
				success: true,
				message: "Token is valid",
				token,
				user: userFromDb,
			},
			{
				status: 200,
			},
		);
	});
	return resp;
}
