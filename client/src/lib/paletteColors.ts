// src/lib/paletteColors.ts
export const paletteColors = {
	mint: {
		badge: "bg-palette-mint text-palette-mint-fg",
		swatch: "bg-palette-mint-fg",
		hex: "#3ddc97",
	},
	cyan: {
		badge: "bg-palette-cyan text-palette-cyan-fg",
		swatch: "bg-palette-cyan-fg",
		hex: "#4de8e8",
	},
	sky: {
		badge: "bg-palette-sky text-palette-sky-fg",
		swatch: "bg-palette-sky-fg",
		hex: "#5cc8ff",
	},
	indigo: {
		badge: "bg-palette-indigo text-palette-indigo-fg",
		swatch: "bg-palette-indigo-fg",
		hex: "#8c7aff",
	},
	violet: {
		badge: "bg-palette-violet text-palette-violet-fg",
		swatch: "bg-palette-violet-fg",
		hex: "#b983ff",
	},
	pink: {
		badge: "bg-palette-pink text-palette-pink-fg",
		swatch: "bg-palette-pink-fg",
		hex: "#ff6b9d",
	},
	rose: {
		badge: "bg-palette-rose text-palette-rose-fg",
		swatch: "bg-palette-rose-fg",
		hex: "#ff4d6d",
	},
	orange: {
		badge: "bg-palette-orange text-palette-orange-fg",
		swatch: "bg-palette-orange-fg",
		hex: "#ff6b3d",
	},
	coral: {
		badge: "bg-palette-coral text-palette-coral-fg",
		swatch: "bg-palette-coral-fg",
		hex: "#ffa073",
	},
	amber: {
		badge: "bg-palette-amber text-palette-amber-fg",
		swatch: "bg-palette-amber-fg",
		hex: "#ffc94d",
	},
	yellow: {
		badge: "bg-palette-yellow text-palette-yellow-fg",
		swatch: "bg-palette-yellow-fg",
		hex: "#ffd166",
	},
	mauve: {
		badge: "bg-palette-mauve text-palette-mauve-fg",
		swatch: "bg-palette-mauve-fg",
		hex: "#9c92bc",
	},
} as const;

export type PaletteColor = keyof typeof paletteColors;
