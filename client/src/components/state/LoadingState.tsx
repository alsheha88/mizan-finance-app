import { ThreeCircles } from "react-loader-spinner";

function LoadingState() {
	return (
		<div className="grid place-items-center min-h-[60dvh]">
			<ThreeCircles color="var(--color-interactive-primary)" />
		</div>
	);
}

export default LoadingState;
