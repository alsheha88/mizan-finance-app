// Tailwind classes for HTML elements (badges, legend dots).
// These switch with the theme by themselves, through the CSS variables.
export const paletteColors = {
	mint: { badge: "bg-palette-mint text-palette-mint-fg", swatch: "bg-palette-mint-fg" },
	cyan: { badge: "bg-palette-cyan text-palette-cyan-fg", swatch: "bg-palette-cyan-fg" },
	sky: { badge: "bg-palette-sky text-palette-sky-fg", swatch: "bg-palette-sky-fg" },
	indigo: { badge: "bg-palette-indigo text-palette-indigo-fg", swatch: "bg-palette-indigo-fg" },
	violet: { badge: "bg-palette-violet text-palette-violet-fg", swatch: "bg-palette-violet-fg" },
	pink: { badge: "bg-palette-pink text-palette-pink-fg", swatch: "bg-palette-pink-fg" },
	rose: { badge: "bg-palette-rose text-palette-rose-fg", swatch: "bg-palette-rose-fg" },
	orange: { badge: "bg-palette-orange text-palette-orange-fg", swatch: "bg-palette-orange-fg" },
	coral: { badge: "bg-palette-coral text-palette-coral-fg", swatch: "bg-palette-coral-fg" },
	amber: { badge: "bg-palette-amber text-palette-amber-fg", swatch: "bg-palette-amber-fg" },
	yellow: { badge: "bg-palette-yellow text-palette-yellow-fg", swatch: "bg-palette-yellow-fg" },
	mauve: { badge: "bg-palette-mauve text-palette-mauve-fg", swatch: "bg-palette-mauve-fg" },
} as const;

export type PaletteColor = keyof typeof paletteColors;

// Written out in full: Tailwind only emits CSS for class names it finds
// literally in the source, so this can never be built at runtime.
export const UNCATEGORISED_BADGE = "bg-surface-active text-text-tertiary";
export const OTHER_BADGE = "bg-surface-active text-text-secondary"

// Real colour values for Chart.js. Charts draw on a <canvas>, which can't
// read CSS variables, so the values are repeated here per theme.
// Keep them in sync with index.css (the -fg tokens and chart tokens).
type ChartTheme = {
	income: string;
	expense: string;
	tick: string;
	grid: string;
	loader: string;
	sliceBorder: string;
	palette: Record<PaletteColor | "uncategorised" | "other", string>;
};

export const chartColors = {
	dark: {
		income: "#3ddc97",
		expense: "#ff6b9d",
		tick: "#6f6494",
		grid: "#ffffff0f",
		loader: "#ff6b3d",
		sliceBorder: "#1a1426",
		palette: {
			mint: "#3ddc97",
			cyan: "#4de8e8",
			sky: "#5cc8ff",
			indigo: "#8c7aff",
			violet: "#b983ff",
			pink: "#ff6b9d",
			rose: "#ff4d6d",
			orange: "#ff6b3d",
			coral: "#ffa073",
			amber: "#ffc94d",
			yellow: "#ffd166",
			mauve: "#9c92bc",
			uncategorised: "#9c92bc",
			other: "#4d4270"
		},
	},
	light: {
		income: "#36764f",
		expense: "#bc405e",
		tick: "#806b80",
		grid: "#e5d5cc",
		loader: "#713bc1",
		sliceBorder: "#ffffff",
		palette: {
			mint: "#305316",
			cyan: "#245e65",
			sky: "#245e65",
			indigo: "#4a3b91",
			violet: "#5d2c9f",
			pink: "#922b50",
			rose: "#902a37",
			orange: "#8f3d23",
			coral: "#8f3d23",
			amber: "#684700",
			yellow: "#684700",
			mauve: "#66516a",
			uncategorised: "#66516a",
			other: "#d5c2ba"
		},
	},
} satisfies Record<"light" | "dark", ChartTheme>;