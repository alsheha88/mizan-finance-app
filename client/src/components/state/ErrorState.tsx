import { XCircle } from "lucide-react";
import { Button } from "../primitives/Button";

type ErrorStateProps = {
	title: string;
	message: string;
	onAction: () => void;
};

function ErrorState({ title, message, onAction }: ErrorStateProps) {
	return (
		<div className="flex flex-col gap-8 justify-center items-center h-full">
			<XCircle className="text-interactive-destructive" />
			<div className="flex flex-col gap-3">
				<h3 className="text-h3 text-text-primary">{title}</h3>
				<p className="text-body-sm text-sidebar-foreground">{message}</p>
			</div>

			<Button type="button" size="lg" variant="secondary" onClick={() => onAction()}>
				Retry
			</Button>
		</div>
	);
}

export default ErrorState;
