"use client";

import React, { useEffect, useRef, useState } from "react";
import { ColorType, createChart, CandlestickSeries, IChartApi, Time, CrosshairMode } from "lightweight-charts";

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
	const tooltipRef = useRef<HTMLDivElement>(null);
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
				background: { type: ColorType.Solid, color: "#1f2228" }, // Dark background (zinc-950)
				textColor: "#e4e4e7", // Light text (zinc-200)
				fontFamily: "'Courier New', -apple-system, BlinkMacSystemFont, sans-serif",
				attributionLogo: false
			},
			grid: {
				vertLines: { color: "rgba(161, 161, 170, 0.06)" }, // Very subtle grid (zinc-500 with low opacity)
				horzLines: { color: "rgba(161, 161, 170, 0.06)" }, // Very subtle grid (zinc-500 with low opacity)
			},
			rightPriceScale: {
				borderColor: "rgba(161, 161, 170, 0.1)", // Subtle border (zinc-500 with low opacity)
				entireTextOnly: true,
			},
			timeScale: {
				timeVisible: true,
				secondsVisible: false,
				borderColor: "rgba(161, 161, 170, 0.1)", // Re-added border color
				tickMarkFormatter: (time: number): string => {
					const date = new Date(time * 1000);
					return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
				},
			},
			crosshair: {
				mode: CrosshairMode.Normal,
				vertLine: {
					color: "rgba(255, 255, 255, 0.2)",
					labelBackgroundColor: "#27272a", // zinc-800
				},
				horzLine: {
					color: "rgba(255, 255, 255, 0.2)",
					labelBackgroundColor: "#27272a", // zinc-800
				},
			},
			width: chartContainerRef.current.clientWidth,
			height: 584,
			handleScale: {
				axisPressedMouseMove: true,
			},
			handleScroll: {
				mouseWheel: true,
				pressedMouseMove: true,
			},
		});

		// Add candlestick series with modern colors
		const candlestickSeries = chart.addSeries(CandlestickSeries, {
			upColor: "#22c55e", // Green-500
			downColor: "#e11d48", // Rose-600
			borderVisible: false,
			wickUpColor: "#22c55e", // Green-500
			wickDownColor: "#e11d48", // Rose-600
			priceFormat: {
				type: "price",
				precision: 2,
				minMove: 0.01,
			},
		});

		// Removed sample data initialization which was causing time format conflicts

		// Configure tooltip to display OHLC values
		chart.subscribeCrosshairMove((param) => {
			if (!tooltipRef.current) return;

			if (param.time && param.point && param.seriesData.get(candlestickSeries)) {
				const data = param.seriesData.get(candlestickSeries);
				if (data) {
					const price = data as CandlestickData;

					// Update tooltip content
					tooltipRef.current.innerHTML = `
						<div class="px-3 py-2">
							<div class="font-semibold text-white mb-1">Price</div>
							<div class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
								<div class="text-zinc-400">Open</div>
								<div class="text-white font-mono">${price.open.toFixed(2)}</div>
								<div class="text-zinc-400">High</div>
								<div class="text-white font-mono">${price.high.toFixed(2)}</div>
								<div class="text-zinc-400">Low</div>
								<div class="text-white font-mono">${price.low.toFixed(2)}</div>
								<div class="text-zinc-400">Close</div>
								<div class="text-white font-mono">${price.close.toFixed(2)}</div>
							</div>
						</div>
					`;

					// Safety check for container ref
					if (chartContainerRef.current) {
						const chartRect = chartContainerRef.current.getBoundingClientRect();
						const tooltipRect = tooltipRef.current.getBoundingClientRect();

						// Position tooltip - with safety checks to prevent positioning errors
						const left = Math.min(param.point.x + 10, chartRect.width - tooltipRect.width - 10);
						const top = Math.min(param.point.y - tooltipRect.height - 10, chartRect.height - tooltipRect.height - 10);

						tooltipRef.current.style.left = `${Math.max(10, left)}px`;
						tooltipRef.current.style.top = `${Math.max(10, top)}px`;
						tooltipRef.current.style.opacity = "1";
					}
				}
			} else {
				// Hide tooltip when not hovering over a data point
				tooltipRef.current.style.opacity = "0";
			}
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

				// Debug: log the formatted time
				console.log("Formatted time:", candlestick.time);

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

	return (
		<div className="relative w-full">
			<div className="rounded-xl border border-zinc-800 bg-[#1f2228] overflow-hidden shadow-lg">
				{/* Status indicator - consistent positioning on right side for both states */}
				<div
					className={`absolute left-3 top-3 flex items-center bg-zinc-800 text-white px-2 py-1 rounded-full text-xs z-10`}
				>
					<span className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"} mr-1.5`}></span>
					<span className="font-medium">{isConnected ? "Live" : "Disconnected"}</span>
				</div>

				{/* Chart container */}
				<div ref={chartContainerRef} className="w-full" />

				{/* Custom tooltip - using ref instead of querySelector */}
				<div
					ref={tooltipRef}
					className="absolute pointer-events-none bg-zinc-800 rounded-lg shadow-lg text-white opacity-0 transition-opacity duration-150 z-20"
					style={{
						top: "10px",
						left: "10px",
						boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
					}}
				></div>
			</div>
		</div>
	);
};

export default Chart;
