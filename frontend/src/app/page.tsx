import Hero from "@/components/home/Hero";
import Showcase from "@/components/home/Showcase";

export default function Home() {
	return (
		<div className="bg-background min-h-screen flex flex-col items-center justify-center gap-2">
			<Hero />
			<Showcase />
		</div>
	);
}
