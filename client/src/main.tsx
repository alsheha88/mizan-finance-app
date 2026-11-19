import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppRoutes } from "./routes/AppRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";

// Non-null assertion is safe here: #root is declared in index.html,
// which ships in this same repo.

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000,
			retry: 1,
		},
	},
});
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<BrowserRouter>
					<AppRoutes />
					<Toaster
						position="top-center"
						toastOptions={{
							style: {
								color: "var(--color-text-primary)",
								backgroundColor: "var(--color-bg-elevated)",
								border: "1px solid var(--color-border-default)",
								boxShadow: "var(--shadow-overlay)",
								fontSize: "var(--text-body-sm)",
							},
						}}
					/>
				</BrowserRouter>
			</ThemeProvider>
		</QueryClientProvider>
	</StrictMode>,
);
