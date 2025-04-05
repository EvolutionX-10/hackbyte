import React from "react";
import { ExternalLink, Github, Twitter, Mail, Linkedin } from "lucide-react";

const Footer = () => {
	return (
		<footer className="bg-[#1e1f25] border-t border-lime-900/30 text-gray-300">
			<div className="max-w-[1400px] mx-auto px-6 py-8">
				{/* Main Footer Content */}
				<div className="flex flex-col md:flex-row justify-between gap-8">
					{/* Logo and Description */}
					<div className="w-full md:w-1/3">
						<div className="flex items-center mb-3">
							<h2 className="text-2xl font-bold text-white">
								<span className="text-lime-400">Grow</span>
								<span className="text-white">Hack</span>
							</h2>
							<div className="ml-2 px-2 py-1 bg-lime-500/10 rounded text-xs font-medium text-lime-400">BETA</div>
						</div>
						<p className="text-sm text-gray-400 mb-4">
							Advanced trading analytics platform designed for high-frequency traders and technical analysts to maximize
							portfolio performance.
						</p>
						<div className="flex space-x-4">
							<a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">
								<Github size={18} />
							</a>
							<a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">
								<Twitter size={18} />
							</a>
							<a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">
								<Linkedin size={18} />
							</a>
							<a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">
								<Mail size={18} />
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full md:w-2/3">
						<div>
							<h3 className="font-medium text-white mb-3">Product</h3>
							<ul className="space-y-2 text-sm">
								<li>
									<a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">
										Dashboard
									</a>
								</li>
								<li>
									<a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">
										Analytics
									</a>
								</li>
								<li>
									<a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">
										Trading Bots
									</a>
								</li>
								<li>
									<a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">
										Integrations
									</a>
								</li>
								<li>
									<a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">
										API Access
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="font-medium text-white mb-3">Resources</h3>
							<ul className="space-y-2 text-sm">
								<li>
									<a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">
										Documentation
									</a>
								</li>
								<li>
									<a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">
										Strategies
									</a>
								</li>
								<li>
									<a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">
										Support
									</a>
								</li>
								<li>
									<a href="#" className="flex items-center text-gray-400 hover:text-lime-400 transition-colors">
										<span>Blog</span>
										<ExternalLink size={14} className="ml-1" />
									</a>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="font-medium text-white mb-3">Company</h3>
							<ul className="space-y-2 text-sm">
								<li>
									<a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">
										About
									</a>
								</li>
								<li>
									<a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">
										Careers
									</a>
								</li>
								<li>
									<a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">
										Privacy
									</a>
								</li>
								<li>
									<a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">
										Terms
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="mt-10 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
					<p>© {new Date().getFullYear()} GrowHack Trading Technologies. All rights reserved.</p>

					<div className="mt-4 md:mt-0 flex items-center">
						<a href="#" className="mr-6 hover:text-lime-400 transition-colors">
							Status
						</a>
						<div className="flex items-center">
							<div className="h-2 w-2 rounded-full bg-lime-400 mr-2"></div>
							<span>All systems operational</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
