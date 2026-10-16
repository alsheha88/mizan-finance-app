import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Non-null assertion is safe here: #root is declared in index.html,
// which ships in this same repo.

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 50 * 1000,
			retry: 1,
		},
	},
});
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<App />
				<Toaster
					position="top-center"
					toastOptions={{
						style: {
							color: "hsla(0, 0%, 98%, 1)",
							backgroundColor: "hsla(240, 10%, 4%, 1)",
							fontSize: "14px",
							border: "1px solid hsla(240, 4%, 16%, 1)",
						},
					}}
				/>
			</BrowserRouter>
		</QueryClientProvider>
	</StrictMode>,
);
