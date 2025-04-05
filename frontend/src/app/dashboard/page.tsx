import Chart from "@/components/chart";

export default function Home() {
	return (
        <div className="h-screen w-screen bg-[#17181c]">
            <div className="p-8 flex w-full gap-20">
                <div className="w-2/3">
                    <h1 className="text-2xl font-bold mb-4 font-sans">Reliance Stock Data</h1>
                    <Chart />
                </div>
                <div className="w-1/3">
                    <span>Hi</span>
                </div>
            </div>
        </div>
    );
}
