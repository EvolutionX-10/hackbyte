import { parse } from "node:url";
import next from "next";
import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { WebSocket, WebSocketServer } from "ws";
import { Socket } from "node:net";
import fs from "fs";
import path from "path";

const nextApp = next({ dev: true, turbopack: true });
const handle = nextApp.getRequestHandler();

const clients: Set<WebSocket> = new Set();

// Path to the dataset
const datasetPath = path.join(process.cwd(), "dataset", "Data_INFY.NS.csv");

// Function to parse the CSV file into an array of objects
function parseCSV(filePath: string) {
	const data = fs.readFileSync(filePath, "utf-8");
	const rows = data.split("\n").slice(3); // Skip the first 3 header rows
	const headers = ["Datetime", "Close", "High", "Low", "Open", "Volume", "SMA_10", "EMA_10", "ROC", "RSI"];

	return rows.map((row) => {
		const values = row.split(",");
		return headers.reduce(
			(acc, header, index) => {
				acc[header] = values[index]?.trim();
				return acc;
			},
			{} as Record<string, string>,
		);
	});
}

// Load the dataset
const stockData = parseCSV(datasetPath);

nextApp.prepare().then(() => {
	const server = createServer((req: IncomingMessage, res: ServerResponse) => {
		handle(req, res, parse(req.url!, true));
	});

	const wss = new WebSocketServer({ noServer: true });

	wss.on("connection", (ws: WebSocket) => {
		clients.add(ws);
		console.log("New Client Connected");

		// Send stock data row by row at 1-minute intervals
		let index = 0;
		const interval = setInterval(() => {
			if (index < stockData.length) {
				const row = stockData[index];
				ws.send(JSON.stringify(row)); // Send the current row as JSON
				// console.log(`Sent row ${index + 1}:`, row);
				index++;
			} else {
				clearInterval(interval); // Stop sending when all rows are sent
				ws.close();
			}
		}, 1000); // 1 minute interval (60000 ms)
		ws.on("message", (message) => {
			const parsed = JSON.parse(message.toString());
			if (parsed.type === "log") {
				console.log("📋 Client Log:", parsed.content);
			}
		});
		
		ws.on("close", () => {
			clients.delete(ws);
			console.log("Client Disconnected");
		});
	});

	server.on("upgrade", (req: IncomingMessage, socket: Socket, head: Buffer) => {
		const { pathname } = parse(req.url!, true);
		if (pathname === "/_next/webpack-hmr") {
			nextApp.getUpgradeHandler()(req, socket, head);
		}

		if (pathname === "/api/ws") {
			wss.handleUpgrade(req, socket, head, (ws) => {
				wss.emit("connection", ws, req);
			});
		}
	});

	server.listen(3000);
	console.log("Server Listening on port 3000");
});
