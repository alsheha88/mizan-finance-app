import { useGetUser } from "@/hooks/user";
import type { ReactNode } from "react";
import { ThreeCircles } from "react-loader-spinner";
import { Navigate } from "react-router-dom";

export function PublicRoute({ children }: { children: ReactNode }) {
	const { data, isLoading } = useGetUser();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen ">
				<ThreeCircles color="#ff6b3d" />
			</div>
		);
	}

	if (data) return <Navigate to={"/dashboard"} replace />;

	return children;
}
