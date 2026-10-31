import { useGetUser } from "@/hooks/user";
import type { ReactNode } from "react";
import { ThreeCircles } from "react-loader-spinner";
import { Navigate, useLocation } from "react-router-dom";

export function PrivateRoute({ children }: { children: ReactNode }) {
	const { isLoading, data } = useGetUser();
	const location = useLocation();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<ThreeCircles color="#10b77f" />
			</div>
		);
	}

	if (!data)
		return <Navigate to={"/login"} replace state={{ from: location }} />;

	return children;
}
