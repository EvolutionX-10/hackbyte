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
		<Card>
			<CardContent className="pt-6">
				<div className="space-y-4">
					<div className="flex flex-wrap items-center justify-between">
						<h3 className="text-lg font-medium">Choose Learning Language</h3>
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
										? "border-primary bg-primary/5"
										: "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
								}`}
								onClick={() => onSelect(language)}
							>
								<RadioGroupItem value={language} id={`language-${language}`} />
								<Label htmlFor={`language-${language}`} className="w-full cursor-pointer">
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
