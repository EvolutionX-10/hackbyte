"use client";

import Chart from "@/components/chart";
import { useEffect, useState } from "react";

export default function Home() {

	return (
		<div className="h-screen w-screen flex items-center justify-center">
			<div className="p-8 w-full">
				<h1 className="text-2xl font-bold mb-4">Reliance Stock Data</h1>
				<Chart />
			</div>
		</div>
	);
}
