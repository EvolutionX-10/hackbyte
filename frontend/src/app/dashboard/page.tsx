"use client";

import React, { useState, useEffect, Suspense } from "react";
import Chart from "@/components/chart";
import PerformanceMetrics from "@/components/metrics";
import TradeLogs from "@/components/trade-logs";
import Loader from "@/components/ui/loader"; // Import the loader directly

type ActionType = "BUY" | "SELL" | "HOLD" | "SHORT";

interface TradeLog {
	id: string;
	timestamp: Date;
	action: ActionType;
	price: number;
	quantity: number;
	value: number;
	profitLoss?: number;
	reason: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const CenteredLoader = () => (
	<div className="min-h-screen bg-[#17181c] flex items-center justify-center">
		<Loader />
	</div>
);
// Lazy load the actual dashboard content
const DashboardContent = React.lazy(async () => {
	await sleep(3000); // Simulate loading for 3 seconds
	// Return a component that renders your dashboard
	return {
		default: ({ metrics, logs }) => (
			<div className="min-h-screen bg-[#17181c] flex items-center justify-center text-white">
				<div className="p-8 w-full max-w-[1400px]">
					<div className="flex flex-col lg:flex-row w-full gap-6 lg:gap-8">
						{/* Chart and Metrics Container */}
						<div className="w-full lg:w-2/3 flex flex-col">
							<div className="mb-4">
								<div className="flex justify-between items-center">
									<h1 className="text-2xl font-bold font-sans">Reliance Stock Data</h1>
									<div className="bg-green-500/10 text-green-500 py-1 px-3 rounded-full text-xs font-medium">
										Live Trading
									</div>
								</div>
							</div>
							<div className="flex-grow mb-4">
								<Chart />
							</div>
							<div>
								<PerformanceMetrics
									cumulativeProfitLoss={metrics.cumulativeProfitLoss}
									winRate={metrics.winRate}
									totalTrades={metrics.totalTrades}
									averageProfit={metrics.averageProfit}
									averageLoss={metrics.averageLoss}
									largestWin={metrics.largestWin}
									largestLoss={metrics.largestLoss}
								/>
							</div>
						</div>

						{/* Logs Container */}
						<div className="w-full lg:w-1/3 lg:h-full overflow-hidden">
							<h1 className="text-2xl font-bold mb-4 font-sans">Logs</h1>
							<TradeLogs logs={logs} />
						</div>
					</div>
				</div>
			</div>
		),
	};
});

export default function Home() {
	const [metrics, setMetrics] = useState({
		cumulativeProfitLoss: 3625.75,
		winRate: 68,
		totalTrades: 42,
		averageProfit: 485.32,
		averageLoss: 217.65,
		largestWin: 1250.4,
		largestLoss: 675.2,
	});

	const [logs, setLogs] = useState<TradeLog[]>([]);
	useEffect(() => {
		async function getLogs() {
			const res = await fetch("http://127.0.0.1:5000/predict");
			const data = await res.json();
			const log = data["Trade Log"];
			let index = logs.length;
			for (let i = 0; i < log.length; i++) {
				const logItem = log[i];
				setLogs((prev) => [...prev, {
					id: String(index++),
					timestamp: new Date(Date.now() - 60000 * i),
					action: logItem[2],
					price: logItem[3],
					quantity: logItem[4],
					value: logItem[3] * logItem[4],
					reason: logItem[5],
				}])
			}
		}
		getLogs();
		const interval = setInterval(() => {
			getLogs();
		}, 60000);
		return () => clearInterval(interval);
	}, [])

	// Now use the loader as the fallback while the dashboard content loads
	return (
		<Suspense fallback={<CenteredLoader />}>
			<DashboardContent metrics={metrics} logs={logs} />
		</Suspense>
	);
}
