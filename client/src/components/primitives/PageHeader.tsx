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
		<div className="flex flex-wrap items-center justify-between gap-4 lg:flex-nowrap lg:gap-12">
			<div className="flex flex-col gap-1 min-w-0 lg:flex-1">
				<Heading
					className={`${Heading === "h1" ? "text-h1" : "text-h2"} text-text-primary`}>
					{title}
				</Heading>
				{subTitle && (
					<p className="text-body-sm text-text-secondary">{subTitle}</p>
				)}
			</div>
			<div className="flex flex-wrap items-center gap-2 min-w-0 w-full lg:w-auto">
				{children}
			</div>
		</div>
	);
}

export default PageHeader;
