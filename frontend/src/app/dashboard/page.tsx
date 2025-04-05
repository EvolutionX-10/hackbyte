"use client";

import React, { useState, useEffect } from "react";
import Chart from "@/components/chart";

import PerformanceMetrics from "@/components/metrics";
import TradeLogs from "@/components/trade-logs";

type ActionType = "BUY" | "SELL" | "HOLD" | "SHORT";

interface TradeLog {
	id: string;
	timestamp: Date;
	action: ActionType; // Using the strict ActionType instead of string
	price: number;
	quantity: number;
	value: number;
	profitLoss?: number;
}

const mockLogs: TradeLog[] = [
	{
		id: "1",
		timestamp: new Date(),
		action: "BUY",
		price: 2450.75,
		quantity: 10,
		value: 24507.5,
	},
	{
		id: "2",
		timestamp: new Date(Date.now() - 120000), // 2 minutes ago
		action: "SELL",
		price: 2448.3,
		quantity: 5,
		value: 12241.5,
		profitLoss: 321.25,
	},
	{
		id: "3",
		timestamp: new Date(Date.now() - 300000), // 5 minutes ago
		action: "HOLD",
		price: 2442.1,
		quantity: 10,
		value: 24421.0,
	},
	{
		id: "4",
		timestamp: new Date(Date.now() - 600000), // 10 minutes ago
		action: "SHORT",
		price: 2460.25,
		quantity: 8,
		value: 19682.0,
		profitLoss: -128.0,
	},
	{
		id: "5",
		timestamp: new Date(Date.now() - 900000), // 15 minutes ago
		action: "BUY",
		price: 2435.6,
		quantity: 12,
		value: 29227.2,
	},
];

export default function Home() {
	const [logs, setLogs] = useState<TradeLog[]>(mockLogs);
	const [metrics, setMetrics] = useState({
		cumulativeProfitLoss: 3625.75,
		winRate: 68,
		totalTrades: 42,
		averageProfit: 485.32,
		averageLoss: 217.65,
		largestWin: 1250.4,
		largestLoss: 675.2,
	});

	useEffect(() => {
		const interval = setInterval(() => {
			const actions: ActionType[] = ["BUY", "SELL", "HOLD", "SHORT"];
			const randomAction = actions[Math.floor(Math.random() * actions.length)];
			const basePrice = 2450;
			const randomPrice = basePrice + (Math.random() * 20 - 10);
			const randomQuantity = Math.floor(Math.random() * 15) + 1;
			const randomProfitLoss =
				randomAction === "SELL" || randomAction === "SHORT" ? Math.random() * 400 - 200 : undefined;

			const newLog: TradeLog = {
				id: Date.now().toString(),
				timestamp: new Date(),
				action: randomAction,
				price: randomPrice,
				quantity: randomQuantity,
				value: randomPrice * randomQuantity,
				profitLoss: randomProfitLoss,
			};

			setLogs((prevLogs) => [newLog, ...prevLogs.slice(0, 49)]);

			if (randomProfitLoss !== undefined) {
				setMetrics((prev) => {
					const newCumulativePL = prev.cumulativeProfitLoss + randomProfitLoss;
					const newTotalTrades = prev.totalTrades + 1;
					const isWin = randomProfitLoss > 0;
					const currentWins = Math.round((prev.winRate * prev.totalTrades) / 100);
					const newWins = isWin ? currentWins + 1 : currentWins;
					const newWinRate = Math.round((newWins / newTotalTrades) * 100);
					const newAvgProfit = isWin
						? (prev.averageProfit * currentWins + randomProfitLoss) / newWins
						: prev.averageProfit;
					const currentLosses = prev.totalTrades - currentWins;
					const newLosses = isWin ? currentLosses : currentLosses + 1;
					const newAvgLoss =
						!isWin && newLosses > 0
							? (prev.averageLoss * currentLosses + Math.abs(randomProfitLoss)) / newLosses
							: prev.averageLoss;
					const newLargestWin = isWin ? Math.max(prev.largestWin, randomProfitLoss) : prev.largestWin;
					const newLargestLoss = !isWin ? Math.max(prev.largestLoss, Math.abs(randomProfitLoss)) : prev.largestLoss;

					return {
						cumulativeProfitLoss: newCumulativePL,
						winRate: newWinRate,
						totalTrades: newTotalTrades,
						averageProfit: newAvgProfit,
						averageLoss: newAvgLoss,
						largestWin: newLargestWin,
						largestLoss: newLargestLoss,
					};
				});
			}
		}, 10000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="min-h-screen bg-[#17181c] flex items-center justify-center text-white">
			<div className="p-8 w-full max-w-[1400px]">
				<div className="flex flex-col lg:flex-row w-full gap-6 lg:gap-8">
					{/* Chart and Metrics Container */}
					<div className="w-full lg:w-2/3 flex flex-col">
						<div className="mb-4">
							<div className="flex justify-between items-center">
								<h1 className="text-2xl font-bold font-sans">Infosys Stock Data</h1>
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
	);
}
