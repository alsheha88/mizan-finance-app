import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

function NotFound() {
	return (
		<div className="min-h-dvh bg-bg-primary flex items-center justify-center p-6">
			<div className="grid gap-5 place-items-center text-center max-w-md">
				<Compass
					className="stroke-interactive-primary stroke-1"
					size={56}
					aria-hidden="true"
				/>
				<div className="grid gap-3">
					<p className="text-h2 text-text-primary">Page not found</p>
					<p className="text-body-md text-text-secondary">
						The page you're looking for doesn't exist, or it may have moved.
					</p>
				</div>
				<Link
					to="/dashboard"
					className="px-4 py-3 rounded-md bg-interactive-primary text-interactive-primary-foreground text-button-md">
					Back to dashboard
				</Link>
			</div>
		</div>
	);
}

export default NotFound;
