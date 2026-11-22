import { useLocalStorage } from "@/hooks/custom/localStorage";
import { useContext, createContext, useEffect } from "react";

interface ThemeContextType {
	theme: "light" | "dark";
	toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [storedTheme, setStoredTheme] = useLocalStorage<"light" | "dark">(
		"theme",
		"dark",
	);
	const theme = storedTheme === "light" ? "light" : "dark";

	useEffect(() => {
		document.documentElement.dataset.theme = theme;
	}, [theme]);

	const toggleTheme = () => {
		setStoredTheme((prev) => (prev === "light" ? "dark" : "light"));
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) throw new Error("useTheme must be used inside ThemeProvider");

	return context;
}
