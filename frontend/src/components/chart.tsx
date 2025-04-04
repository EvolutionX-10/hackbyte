"use client";

import React, { useEffect, useRef, useState } from "react";
import { ColorType, createChart, CandlestickSeries, IChartApi, Time } from "lightweight-charts";

// Type definition for the data received from WebSocket
interface StockDataPoint {
	Datetime: string;
	Close: string;
	High: string;
	Low: string;
	Open: string;
	Volume: string;
	SMA_10: string;
	EMA_10: string;
	ROC: string;
	RSI: string;
}

// Type definition for candlestick data point
interface CandlestickData {
	time: Time;
	open: number;
	high: number;
	low: number;
	close: number;
}

const Chart = () => {
	const chartContainerRef = useRef<HTMLDivElement>(null);
	const chartRef = useRef<IChartApi | null>(null);
	const seriesRef = useRef<ReturnType<IChartApi["addSeries"]> | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	// Function to format datetime from your format to lightweight charts format
	const formatDatetime = (datetime: string): Time => {
		// Replace the space with "T" to conform to ISO format
		const isoDatetime = datetime.replace(" ", "T");
		const date = new Date(isoDatetime);
		return Math.floor(date.getTime() / 1000) as Time; // Cast to Time
	};

	// Convert WebSocket data to candlestick format
	const convertToCandlestick = (data: StockDataPoint): CandlestickData => {
		return {
			time: formatDatetime(data.Datetime),
			open: parseFloat(data.Open),
			high: parseFloat(data.High),
			low: parseFloat(data.Low),
			close: parseFloat(data.Close),
		};
	};

	useEffect(() => {
		// Initialize chart
		if (!chartContainerRef.current) return;

		const chart = createChart(chartContainerRef.current, {
			layout: {
				background: { type: ColorType.Solid, color: "#ffffff" },
				textColor: "#333",
			},
			width: chartContainerRef.current.clientWidth,
			height: 500,
			timeScale: {
				timeVisible: true,
				secondsVisible: false,
			},
		});

		// Add candlestick series
		const candlestickSeries = chart.addSeries(CandlestickSeries, {
			upColor: "#26a69a",
			downColor: "#ef5350",
			borderVisible: false,
			wickUpColor: "#26a69a",
			wickDownColor: "#ef5350",
		});

		// Store references
		chartRef.current = chart;
		seriesRef.current = candlestickSeries;

		// Handle window resize
		const handleResize = () => {
			if (chartRef.current && chartContainerRef.current) {
				chartRef.current.applyOptions({
					width: chartContainerRef.current.clientWidth,
				});
			}
		};

		window.addEventListener("resize", handleResize);

		// Connect to WebSocket
		const ws = new WebSocket("ws://localhost:3000/api/ws");

		ws.onopen = () => {
			console.log("WebSocket Connected");
			setIsConnected(true);
		};

		ws.onmessage = (event) => {
			try {
				const data: StockDataPoint = JSON.parse(event.data);
				const candlestick = convertToCandlestick(data);

				if (seriesRef.current) {
					// Update the chart with new data
					seriesRef.current.update(candlestick);

					// Optional: Scroll to the latest data point
					chartRef.current?.timeScale().scrollToRealTime();
				}
			} catch (error) {
				console.error("Error processing WebSocket data:", error);
			}
		};

		ws.onclose = () => {
			console.log("WebSocket Disconnected");
			setIsConnected(false);
		};

		ws.onerror = (error) => {
			console.error("WebSocket Error:", error);
			setIsConnected(false);
		};

		// Cleanup function
		return () => {
			window.removeEventListener("resize", handleResize);
			ws.close();
			if (chartRef.current) {
				chartRef.current.remove();
			}
		};
	}, []);

	// Optional: Add real-time indicator
	const connectionStatus = isConnected ? (
		<div className="absolute right-2 top-2 bg-green-500 text-white px-2 py-1 rounded text-xs">Live</div>
	) : (
		<div className="absolute right-2 top-2 bg-red-500 text-white px-2 py-1 rounded text-xs">Disconnected</div>
	);

	return (
		<div className="relative w-full">
			{connectionStatus}
			<div ref={chartContainerRef} className="w-full" />
			<div className="text-center mt-2">
				<button
					onClick={() => chartRef.current?.timeScale().scrollToRealTime()}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					Go to Real-time
				</button>
			</div>
		</div>
	);
};

export default Chart;
