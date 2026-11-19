import { ThreeCircles } from "react-loader-spinner";

function LoadingState() {
	return (
		<div className="grid place-items-center py-20 h-dvh">
			<ThreeCircles color="var(--color-interactive-primary)" />
		</div>
	);
}

export default LoadingState;
