import React from "react";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";

interface PerformanceMetricsProps {
	cumulativeProfitLoss: number;
	winRate: number;
	totalTrades: number;
	averageProfit: number;
	averageLoss: number;
	largestWin: number;
	largestLoss: number;
}

const PerformanceMetrics = ({
	cumulativeProfitLoss,
	winRate,
	totalTrades,
	averageProfit,
	averageLoss,
	largestWin,
	largestLoss,
}: PerformanceMetricsProps) => {
	return (
		<div className="mt-4 bg-[#1c1d23] rounded-lg p-4">
			<div className="grid grid-cols-4 gap-4">
				{/* Cumulative Profit/Loss - Main Metric */}
				<div className="col-span-4 md:col-span-1 bg-[#1e1f25] rounded-lg p-4 border-l-4 border-blue-500">
					<div className="flex justify-between items-center">
						<h3 className="text-gray-400 text-sm">Total P&L</h3>
						{cumulativeProfitLoss >= 0 ? (
							<TrendingUpIcon size={20} className="text-green-500" />
						) : (
							<TrendingDownIcon size={20} className="text-red-500" />
						)}
					</div>
					<div className={`text-2xl font-bold ${cumulativeProfitLoss >= 0 ? "text-green-500" : "text-red-500"}`}>
						₹
						{Math.abs(cumulativeProfitLoss).toLocaleString("en-IN", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
						<span className="text-sm ml-1">{cumulativeProfitLoss >= 0 ? "profit" : "loss"}</span>
					</div>
				</div>

				{/* Other Important Metrics */}
				<div className="col-span-2 md:col-span-1 bg-[#1e1f25] rounded-lg p-4">
					<p className="text-gray-400 text-sm">Win Rate</p>
					<p className="text-xl font-bold text-white">{winRate}%</p>
					<div className="mt-2 bg-gray-700 h-1.5 rounded-full">
						<div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${winRate}%` }}></div>
					</div>
				</div>

				<div className="col-span-2 md:col-span-1 bg-[#1e1f25] rounded-lg p-4">
					<p className="text-gray-400 text-sm">Total Trades</p>
					<p className="text-xl font-bold text-white">{totalTrades}</p>
					<p className="text-xs text-gray-400 mt-2">Today</p>
				</div>

				<div className="col-span-4 md:col-span-1 bg-[#1e1f25] rounded-lg p-4">
					<div className="flex justify-between">
						<div>
							<p className="text-gray-400 text-sm">Avg. Profit</p>
							<p className="text-lg font-medium text-green-500">
								₹{averageProfit.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							</p>
						</div>
						<div className="text-right">
							<p className="text-gray-400 text-sm">Avg. Loss</p>
							<p className="text-lg font-medium text-red-500">
								₹{averageLoss.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							</p>
						</div>
					</div>
				</div>

				{/* Additional Metrics */}
				<div className="col-span-2 md:col-span-2 bg-[#1e1f25] rounded-lg p-4">
					<p className="text-gray-400 text-sm mb-2">Trading Performance</p>
					<div className="flex justify-between items-center">
						<div className="flex flex-col">
							<span className="text-xs text-gray-400">BUY</span>
							<div className="h-4 bg-green-500/20 w-24 rounded-sm mt-1">
								<div className="h-4 bg-green-500 rounded-sm" style={{ width: "65%" }}></div>
							</div>
						</div>
						<div className="flex flex-col">
							<span className="text-xs text-gray-400">SELL</span>
							<div className="h-4 bg-red-500/20 w-24 rounded-sm mt-1">
								<div className="h-4 bg-red-500 rounded-sm" style={{ width: "45%" }}></div>
							</div>
						</div>
						<div className="flex flex-col">
							<span className="text-xs text-gray-400">SHORT</span>
							<div className="h-4 bg-blue-500/20 w-24 rounded-sm mt-1">
								<div className="h-4 bg-blue-500 rounded-sm" style={{ width: "30%" }}></div>
							</div>
						</div>
					</div>
				</div>

				<div className="col-span-2 md:col-span-2 bg-[#1e1f25] rounded-lg p-4">
					<div className="flex justify-between">
						<div>
							<p className="text-gray-400 text-sm">Best Trade</p>
							<p className="text-lg font-medium text-green-500">
								₹{largestWin.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							</p>
						</div>
						<div className="text-right">
							<p className="text-gray-400 text-sm">Worst Trade</p>
							<p className="text-lg font-medium text-red-500">
								₹{largestLoss.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PerformanceMetrics;
