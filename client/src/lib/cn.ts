import clsx, { type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const fontSizes = [
	"display-lg", "display-md", "display-sm",
	"h1", "h2", "h3", "h4",
	"body-lg", "body-md", "body-sm",
	"caption-lg", "caption-md", "caption-sm",
	"label-lg", "label-md", "label-sm",
	"button-lg", "button-md", "button-sm",
];

const twMerge = extendTailwindMerge({
	extend: { classGroups: { "font-size": [{ text: fontSizes }] } },
});

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));