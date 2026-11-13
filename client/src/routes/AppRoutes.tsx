import { Navigate, Route, Routes } from "react-router-dom";
import App from "@/App";
import { PublicRoute } from "@/routes/PublicRoutes";
import Login from "@/pages/authPages/Login";
import Signup from "@/pages/authPages/Signup";
import Dashboard from "@/pages/featuresPages/Dashboard";
import Accounts from "@/pages/featuresPages/Accounts";
import Income from "@/pages/featuresPages/Income";
import Expenses from "@/pages/featuresPages/Expenses";
import Cards from "@/pages/featuresPages/CreditCards";
import Loans from "@/pages/featuresPages/Loans";
import Profile from "@/pages/featuresPages/Profile";
import NotFound from "@/pages/NotFound";
import Assistant from "@/pages/featuresPages/Assistant";

export function AppRoutes() {
	return (
		<Routes>
			<Route
				path="/login"
				element={
					<PublicRoute>
						<Login />
					</PublicRoute>
				}
			/>
			<Route
				path="/signup"
				element={
					<PublicRoute>
						<Signup />
					</PublicRoute>
				}
			/>

			<Route element={<App />}>
				<Route path="/" element={<Navigate to="/dashboard" replace />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/accounts" element={<Accounts />} />
				<Route path="/income" element={<Income />} />
				<Route path="/expenses" element={<Expenses />} />
				<Route path="/cards" element={<Cards />} />
				<Route path="/loans" element={<Loans />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/assistant" element={<Assistant />} />
				<Route path="/assistant/:conversationId?" element={<Assistant />} />
			</Route>

			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}
