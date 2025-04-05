import Navbar from "@/components/Navbar";

export default function Home() {
	return (
		<>
			<header>
				<Navbar />
			</header>
			<main className="bg-background h-screen w-screen flex items-center justify-center">
				<div className="text-5xl">HackByte</div>
			</main>
		</>
	);
}
