declare module "bun" {
	interface Env {
		DATABASE_URL: string;
		JWT_SECRET: string;
		GOOGLE_GENERATIVE_AI_API_KEY: string;
	}
}
