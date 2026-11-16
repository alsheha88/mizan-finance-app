import { Outlet } from "react-router-dom";
import { PrivateRoute } from "./routes/PrivateRoute";
import { Sidebar } from "./components/primitives/Sidebar";
import { MobileTabBar } from "./components/primitives/MobileTabBar";

function App() {
	return (
		<PrivateRoute>
			<div className="bg-bg-primary flex min-h-dvh">
				<Sidebar />
				<main className="flex-1 px-6 pt-6 min-w-0 pb-[calc(5rem+env(safe-area-inset-bottom))]">
					<Outlet />
				</main>
				<MobileTabBar />
			</div>
		</PrivateRoute>
	);
}

export default App;
