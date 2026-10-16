import { NavLink } from "react-router-dom";
import { cn } from "../../lib/cn";
import type { ReactNode } from "react";

type NavItemProp = {
	to: string;
	icon: ReactNode;
	content: string;
};

export function NavItem({ to, icon, content }: NavItemProp) {
	return (
		<NavLink
			to={to}
			className={({ isActive }) =>
				cn(
					"p-3 flex items-center gap-3 rounded-md text-label-lg transition-colors",
					isActive
						? "bg-accent-default text-sidebar-active-foreground [&>svg]:stroke-interactive-primary"
						: "text-sidebar-foreground hover:bg-sidebar-hover ",
				)
			}>
			{icon}
			{content}
		</NavLink>
	);
}
