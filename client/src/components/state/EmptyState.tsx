import type { ReactNode } from "react";

type EmptyStateProps = {
	icon: ReactNode;
	title: string;
	message: string;
	children?: ReactNode;
};

function EmptyState({ icon, title, message, children }: EmptyStateProps) {
	return (
		<div className="grid gap-4 py-16 place-items-center text-center">
			{icon}
			<div className="flex flex-col gap-3">
				<h3 className="text-h3 text-text-primary">{title}</h3>
				<p className="text-body-md text-text-secondary">{message}</p>
			</div>
			{children}
		</div>
	);
}

export default EmptyState;
