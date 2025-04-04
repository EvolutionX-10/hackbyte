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

			return await response.json();
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

			return await response.json();
		} catch (error) {
			throw new Error((error as Error).message || "Signup failed");
		}
	}
}

export default Auth;
