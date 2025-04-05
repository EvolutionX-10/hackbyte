import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
	email: string;
	jwt: string;
	setEmail: (email: string) => void;
	setJwt: (jwt: string) => void;
}

export const useAuth = create<UserStore>()(
	persist(
		(set) => ({
			email: "",
			jwt: "",
			setEmail: (email: string) => set({ email }),
			setJwt: (jwt: string) => set({ jwt }),
		}),
		{
			name: "auth-storage",
		},
	),
);
