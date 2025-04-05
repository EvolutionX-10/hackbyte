import { User } from "@prisma/client";

class Auth {
	static async login(email: string, password: string) {
		try {
			const response = await fetch("/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Login failed");
			}

			return (await response.json()) as Promise<AuthResponse>;
		} catch (error) {
			throw new Error((error as Error).message || "Login failed");
		}
	}

	static async signup(email: string, password: string) {
		try {
			const response = await fetch("/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Signup failed");
			}

			return (await response.json()) as Promise<AuthResponse>;
		} catch (error) {
			throw new Error((error as Error).message || "Signup failed");
		}
	}

	static async getUser(token: string) {
		const response = await fetch("/api/get-user", {
			method: "POST",
			body: JSON.stringify({ token }),
		});
		return (await response.json()) as Promise<AuthResponse> & Promise<{ user: Omit<User, "password"> }>;
	}
}

export default Auth;

type AuthResponse =
	| {
			success: true;
			message: string;
			token: string;
	  }
	| {
			success: false;
			message: string;
			token: never;
	  };
