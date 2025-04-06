import React from "react";
import { Dot, ExternalLink, Heart } from "lucide-react";

const Footer = () => {
	return (
		<footer className="bg-[#1e1f25] border-t border-lime-50/20 text-gray-300">
			<div className="max-w-[1400px] mx-auto px-6 py-8">
				<div className="flex flex-col">
					{/* Brand */}
					<div className="mb-12 flex items-start gap-2">
						<h2 className="text-4xl font-bold text-white">
							<span className="text-lime-400">Grow</span>
							<span className="text-white">Hack</span>
						</h2>
						<div className="-mt-1 px-2 py-1 bg-lime-500/10 rounded text-xs font-medium text-lime-400 inline-block">
							BETA
						</div>
					</div>

					{/* Dashed Divider */}
					<div className="w-full border-t border-dashed border-gray-600 my-4"></div>

					{/* Minimal Nav Links with Vertical Dividers */}
					<div className="flex items-center">
						<a href="#" className="hover:text-lime-400 transition-colors">
							Dashboard
						</a>
						<div className="h-6 border-l border-dashed border-gray-600 mx-4"></div>
						<a href="#" className="hover:text-lime-400 transition-colors">
							About
						</a>
						<div className="h-6 border-l border-dashed border-gray-600 mx-4"></div>
						<a href="#" className="hover:text-lime-400 transition-colors">
							Contact
						</a>
					</div>

					{/* Dashed Divider */}
					<div className="w-full border-t border-dashed border-gray-600 my-4"></div>

					{/* Bottom Info */}
					<div className="text-left text-sm text-gray-500">
						<p>© {new Date().getFullYear()} GrowHack Trading Technologies. All rights reserved.</p>
						<div className="mt-2 flex items-center w-full md:justify-between">
							<div className="flex items-center">
								<div className="h-2 w-2 rounded-full bg-lime-400 mr-2"></div>
								<span>All systems operational</span>
							</div>
							<div className="flex justify-center items-center">
								<p className="flex items-center text-sm text-gray-400">
									Made with <Heart size={14} className="mx-1 text-lime-400 fill-lime-400" /> by Team Pandora Reboot
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
