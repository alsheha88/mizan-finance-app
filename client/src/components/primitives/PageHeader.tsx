import type { ReactNode } from "react";
type PageHeaderProps = {
	title: string;
	subTitle?: string;
	as?: "h1" | "h2";
	children?: ReactNode;
};

function PageHeader({
	as: Heading = "h1",
	title,
	subTitle,
	children,
}: PageHeaderProps) {
	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-col gap-1">
				<Heading className="text-h1 text-text-primary">{title}</Heading>
				{subTitle && (
					<p className="text-body-sm text-text-secondary">{subTitle}</p>
				)}
			</div>
			<div className="flex items-center gap-2">{children}</div>
		</div>
	);
}

export default PageHeader;
