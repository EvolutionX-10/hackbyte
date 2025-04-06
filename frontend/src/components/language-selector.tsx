import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Available languages for teaching content
export enum ContentLanguage {
	ENGLISH = "English",
	SPANISH = "Spanish",
	FRENCH = "French",
	GERMAN = "German",
	CHINESE = "Chinese",
	JAPANESE = "Japanese",
	HINDI = "Hindi",
	ARABIC = "Arabic",
}

interface LanguageSelectorProps {
	selectedLanguage: ContentLanguage;
	onSelect: (language: ContentLanguage) => void;
}

export function LanguageSelector({ selectedLanguage, onSelect }: LanguageSelectorProps) {
	return (
		<Card className="bg-[#1c1d23] border-gray-700">
			<CardContent className="pt-6">
				<div className="space-y-4">
					<div className="flex flex-wrap items-center justify-between">
						<h3 className="text-lg font-medium text-gray-100">Choose Learning Language</h3>
					</div>

					<RadioGroup
						value={selectedLanguage}
						onValueChange={(value) => {
							onSelect(value as ContentLanguage);
						}}
						className="grid grid-cols-2 md:grid-cols-4 gap-3"
					>
						{Object.values(ContentLanguage).map((language) => (
							<div
								key={language}
								className={`flex items-center space-x-2 border rounded-lg p-3 cursor-pointer ${
									selectedLanguage === language
										? "border-blue-500 bg-blue-500/20"
										: "border-gray-700 hover:bg-gray-800"
								}`}
								onClick={() => onSelect(language)}
							>
								<RadioGroupItem value={language} id={`language-${language}`} className="text-blue-400"/>
								<Label htmlFor={`language-${language}`} className="w-full cursor-pointer text-gray-200">
									{language}
								</Label>
							</div>
						))}
					</RadioGroup>
				</div>
			</CardContent>
		</Card>
	);
}
