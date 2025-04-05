"use client";

import React, { useState, useEffect } from "react";
import Chart from "@/components/chart";
import TradeLogs from "@/components/trade-logs";
import PerformanceMetrics from "@/components/metrics";

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

	// Simulate real-time updates from WebSocket
	useEffect(() => {
		// In a real implementation, this would be a WebSocket connection
		const interval = setInterval(() => {
			// Use properly typed actions array
			const actions: ActionType[] = ["BUY", "SELL", "HOLD", "SHORT"];
			const randomAction = actions[Math.floor(Math.random() * actions.length)];
			const basePrice = 2450;
			const randomPrice = basePrice + (Math.random() * 20 - 10);
			const randomQuantity = Math.floor(Math.random() * 15) + 1;

			// Generate random profit/loss for SELL and SHORT actions
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

			setLogs((prevLogs) => [newLog, ...prevLogs.slice(0, 49)]); // Keep last 50 logs

			// Update metrics when there's a profit/loss value
			if (randomProfitLoss !== undefined) {
				setMetrics((prev) => {
					const newCumulativePL = prev.cumulativeProfitLoss + randomProfitLoss;
					const newTotalTrades = prev.totalTrades + 1;

					// Calculate new win rate
					const isWin = randomProfitLoss > 0;
					const currentWins = Math.round((prev.winRate * prev.totalTrades) / 100);
					const newWins = isWin ? currentWins + 1 : currentWins;
					const newWinRate = Math.round((newWins / newTotalTrades) * 100);

					// Update average profit/loss
					const newAvgProfit = isWin
						? (prev.averageProfit * currentWins + randomProfitLoss) / newWins
						: prev.averageProfit;

					const currentLosses = prev.totalTrades - currentWins;
					const newLosses = isWin ? currentLosses : currentLosses + 1;
					const newAvgLoss =
						!isWin && newLosses > 0
							? (prev.averageLoss * currentLosses + Math.abs(randomProfitLoss)) / newLosses
							: prev.averageLoss;

					// Update best/worst trades
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
		}, 10000); // New log every 30 seconds

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="h-screen w-screen bg-[#17181c] flex items-center justify-center text-white overflow-auto">
			<div className="p-8 flex flex-col w-full">
				<div className="flex flex-col lg:flex-row w-full gap-6 lg:gap-12">
					<div className="w-full lg:w-2/3">
						<div className="flex justify-between items-center mb-4">
							<h1 className="text-2xl font-bold font-sans">Reliance Stock Data</h1>
							<div className="bg-green-500/10 text-green-500 py-1 px-3 rounded-full text-xs font-medium">
								Live Trading
							</div>
						</div>
						<Chart />

						{/* Performance Metrics Panel */}
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

					<div className="w-full lg:w-1/3">
						<h1 className="text-2xl font-bold mb-4 font-sans">Logs</h1>
						<TradeLogs logs={logs} />
					</div>
				</div>
			</div>
		</div>
	);
}
