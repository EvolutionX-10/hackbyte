"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Auth from "@/lib/auth";
import { useAuth } from "@/store";

export default function SignUpPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);
	const { setEmail: setLocalEmail, setJwt } = useAuth();

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setLoading(true);
		try {
			const response = await Auth.signup(email, password);
			if (response.success) {
				setLocalEmail(email);
				setJwt(response.token);
				router.push("/");
			}
			setSuccess(response.message);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-background">
			<form onSubmit={handleSignUp} className="w-full max-w-sm p-6 bg-secondary rounded shadow-md">
				<h1 className="mb-6 text-2xl font-bold text-center text-foreground">Sign Up</h1>
				{error && <p className="mb-4 text-sm text-destructive">{error}</p>}
				{success && <p className="mb-4 text-sm text-primary">{success}</p>}
				<div className="mb-4">
					<label htmlFor="email" className="block mb-2 text-sm font-medium text-foreground">
						Email
					</label>
					<Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
				</div>
				<div className="mb-6">
					<label htmlFor="password" className="block mb-2 text-sm font-medium text-foreground">
						Password
					</label>
					<Input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<Button type="submit" variant="default" size="default" disabled={loading} className="text-background">
					{loading ? "Signing up..." : "Sign Up"}
				</Button>
			</form>
		</div>
	);
}
