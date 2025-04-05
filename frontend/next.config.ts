import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	serverExternalPackages: ["ws"],
	reactStrictMode: false,
};

export default nextConfig;
