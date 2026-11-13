import { NavLink } from "react-router-dom";
import { cn } from "../../lib/cn";
import type { LucideIcon } from "lucide-react";

type NavItemProp = {
	to: string;
	icon: LucideIcon;
	content: string;
};

export function NavItem({ to, icon, content }: NavItemProp) {
	const Icon = icon;
	return (
		<NavLink
			to={to}
			className={({ isActive }) =>
				cn(
					"px-3 py-2 flex items-center gap-3 rounded-sm text-label-lg transition-colors relative",
					isActive
						? "bg-sidebar-hover text-sidebar-active-foreground [&>svg]:stroke-interactive-primary before:absolute before:inset-s-0 before:h-full before:w-0.75 before:rounded-full before:bg-interactive-primary"
						: "text-sidebar-foreground hover:bg-sidebar-hover hover:text-text-primary",
				)
			}>
			<Icon size={18} aria-hidden />
			{content}
		</NavLink>
	);
}
