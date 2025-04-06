import React from "react";
import { Safari } from "../magicui/safari";
import { SafariV2 } from "../magicui/dynamic-safari";

const Showcase: React.FC = () => {
	return (
		<div className="relative">
			{/* <Safari 
                url="growhack.ai" 
                className="aspect-[16/9] w-full max-w-[64rem] mx-auto" 
                imageSrc="/placeholder.png" 
            /> */}
            
            <SafariV2
                url="growhack.ai"
                className="aspect-[16/9] w-full max-w-[64rem] mx-auto"
                iframeSrc="https://growhack.vercel.app/dashboard"
            />
		</div>
	);
};

export default Showcase;
