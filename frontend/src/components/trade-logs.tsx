import React from "react";
import { ArrowUpCircle, ArrowDownCircle, PauseCircle, Repeat } from "lucide-react";

// Define the trade log entry structure
type ActionType = "BUY" | "SELL" | "HOLD" | "SHORT";

interface TradeLog {
	id: string;
	timestamp: Date;
	action: ActionType;
	price: number;
	quantity: number;
	value: number;
	profitLoss?: number;
}

interface TradeLogsProps {
	logs: TradeLog[];
}

const TradeLogItem = ({ log }: { log: TradeLog }) => {
	// Define action-specific styling and icons
	const getActionDetails = (action: ActionType) => {
		switch (action) {
			case "BUY":
				return {
					icon: <ArrowUpCircle size={20} className="text-green-500" />,
					bgColor: "bg-green-500/10",
					textColor: "text-green-500",
				};
			case "SELL":
				return {
					icon: <ArrowDownCircle size={20} className="text-red-500" />,
					bgColor: "bg-red-500/10",
					textColor: "text-red-500",
				};
			case "HOLD":
				return {
					icon: <PauseCircle size={20} className="text-yellow-500" />,
					bgColor: "bg-yellow-500/10",
					textColor: "text-yellow-500",
				};
			case "SHORT":
				return {
					icon: <Repeat size={20} className="text-blue-500" />,
					bgColor: "bg-blue-500/10",
					textColor: "text-blue-500",
				};
		}
	};

	const { icon, bgColor, textColor } = getActionDetails(log.action);

	return (
		<div className="bg-[#1e1f25] rounded-lg p-4 mb-3 border-l-4 border-[#2e2f36] hover:border-l-blue-500 transition-all">
			<div className="flex justify-between items-center">
				<div className="flex items-center gap-3">
					<div className={`h-10 w-10 rounded-full ${bgColor} flex items-center justify-center`}>{icon}</div>
					<div>
						<p className={`font-semibold ${textColor}`}>{log.action}</p>
						<p className="text-gray-400 text-sm">{new Date(log.timestamp).toLocaleTimeString()}</p>
					</div>
				</div>
				<div className="text-right">
					<p className="font-mono text-gray-200">₹{log.price.toFixed(2)}</p>
					<p className="text-gray-400 text-sm">x{log.quantity}</p>
				</div>
			</div>
			<div className="mt-3 flex justify-between items-center pt-2 border-t border-[#2e2f36]">
				<span className="text-gray-300 text-sm">
					Value: <span className="font-medium">₹{log.value.toFixed(2)}</span>
				</span>
				{log.profitLoss !== undefined && (
					<span className={`text-sm ${log.profitLoss >= 0 ? "text-green-500" : "text-red-500"}`}>
						P/L: <span className="font-medium">₹{log.profitLoss.toFixed(2)}</span>
					</span>
				)}
			</div>
		</div>
	);
};

const TradeLogs = ({ logs }: TradeLogsProps) => {
	return (
		<div className="bg-[#1c1d23] h-[calc(100vh-120px)] rounded-lg p-4 overflow-hidden flex flex-col">
			<div className="flex justify-between items-center mb-4">
				<div className="bg-blue-500/10 text-blue-500 py-1 px-3 rounded-full text-xs font-medium">Live Trading</div>
				<div className="text-gray-400 text-sm">{logs.length} actions today</div>
			</div>

			<div className="overflow-y-auto flex-grow pr-2 custom-scrollbar">
				{logs.length > 0 ? (
					logs.map((log) => <TradeLogItem key={log.id} log={log} />)
				) : (
					<div className="h-full flex items-center justify-center text-gray-500">No trading activity yet</div>
				)}
			</div>

			<style jsx>{`
				.custom-scrollbar::-webkit-scrollbar {
					width: 6px;
				}
				.custom-scrollbar::-webkit-scrollbar-track {
					background: #1c1d23;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb {
					background-color: #2e2f36;
					border-radius: 20px;
				}
			`}</style>
		</div>
	);
};

export default TradeLogs;
