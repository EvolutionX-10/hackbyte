"use client";

import { useEffect, useState } from "react";

export default function Home() {
	const [stockData, setStockData] = useState<any[]>([]);

	useEffect(() => {
		// Connect to the WebSocket server
		const ws = new WebSocket("ws://localhost:3000/api/ws");

		ws.onopen = () => {
			console.log("WebSocket connection established");
		};

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			setStockData((prev) => [...prev, data]);
		};

		ws.onclose = () => {
			console.log("WebSocket connection closed");
		};

		ws.onerror = (error) => {
			console.error("WebSocket error:", error);
		};

		// Cleanup WebSocket connection on component unmount
		return () => ws.close();
	}, []);

	return (
		<div className="h-screen w-screen flex items-center justify-center">
			<div className="p-8">
				<h1 className="text-2xl font-bold mb-4">Reliance Stock Data</h1>
				<ul className="list-disc pl-5">
					{stockData.map((data, index) => (
						<li key={index} className="mb-2">
							<strong>{data.Datetime}</strong>: {data.Close}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
