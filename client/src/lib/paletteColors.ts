// src/lib/paletteColors.ts
export const paletteColors = {
	mint: {
		badge: "bg-palette-mint text-palette-mint-fg",
		swatch: "bg-palette-mint-fg",
		hex: "#3ddc97",
		rgba: "rgba(61, 220, 151, 1)",
	},
	cyan: {
		badge: "bg-palette-cyan text-palette-cyan-fg",
		swatch: "bg-palette-cyan-fg",
		hex: "#4de8e8",
		rgba: "rgba(77, 232, 232, 1)",
	},
	sky: {
		badge: "bg-palette-sky text-palette-sky-fg",
		swatch: "bg-palette-sky-fg",
		hex: "#5cc8ff",
		rgba: "rgba(92, 200, 255, 1)",
	},
	indigo: {
		badge: "bg-palette-indigo text-palette-indigo-fg",
		swatch: "bg-palette-indigo-fg",
		hex: "#8c7aff",
		rgba: "rgba(140, 122, 255, 1)",
	},
	violet: {
		badge: "bg-palette-violet text-palette-violet-fg",
		swatch: "bg-palette-violet-fg",
		hex: "#b983ff",
		rgba: "rgba(185, 131, 255, 1)",
	},
	pink: {
		badge: "bg-palette-pink text-palette-pink-fg",
		swatch: "bg-palette-pink-fg",
		hex: "#ff6b9d",
		rgba: "rgba(255, 107, 157, 1)",
	},
	rose: {
		badge: "bg-palette-rose text-palette-rose-fg",
		swatch: "bg-palette-rose-fg",
		hex: "#ff4d6d",
		rgba: "rgba(255, 77, 109, 1)",
	},
	orange: {
		badge: "bg-palette-orange text-palette-orange-fg",
		swatch: "bg-palette-orange-fg",
		hex: "#ff6b3d",
		rgba: "rgba(255, 107, 61, 1)",
	},
	coral: {
		badge: "bg-palette-coral text-palette-coral-fg",
		swatch: "bg-palette-coral-fg",
		hex: "#ffa073",
		rgba: "rgba(255, 160, 115, 1)",
	},
	amber: {
		badge: "bg-palette-amber text-palette-amber-fg",
		swatch: "bg-palette-amber-fg",
		hex: "#ffc94d",
		rgba: "rgba(255, 201, 77, 1)",
	},
	yellow: {
		badge: "bg-palette-yellow text-palette-yellow-fg",
		swatch: "bg-palette-yellow-fg",
		hex: "#ffd166",
		rgba: "rgba(255, 209, 102, 1)",
	},
	mauve: {
		badge: "bg-palette-mauve text-palette-mauve-fg",
		swatch: "bg-palette-mauve-fg",
		hex: "#9c92bc",
		rgba: "rgba(156, 146, 188, 1)",
	},
} as const;
export const UNCATEGORISED = "rgba(156, 146, 188, 1)";
// Written out in full: Tailwind only emits CSS for class names it finds
// literally in the source, so this can never be built at runtime.
export const UNCATEGORISED_BADGE = "bg-surface-active text-text-tertiary";

export const PALETTECOLOR: Record<PaletteColor, string> = {
	mint: "rgba(61, 220, 151, 1)",
	cyan: "rgba(77, 232, 232, 1)",

	sky: "rgba(92, 200, 255, 1)",

	indigo: "rgba(140, 122, 255, 1)",

	violet: "rgba(185, 131, 255, 1)",

	pink: "rgba(255, 107, 157, 1)",

	rose: "rgba(255, 77, 109, 1)",

	orange: "rgba(255, 107, 61, 1)",

	coral: "rgba(255, 160, 115, 1)",

	amber: "rgba(255, 201, 77, 1)",

	yellow: "rgba(255, 209, 102, 1)",

	mauve: "rgba(156, 146, 188, 1)",
};

export type PaletteColor = keyof typeof paletteColors;
