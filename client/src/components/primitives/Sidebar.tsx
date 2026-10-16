import { navItems } from "@/lib/navItems";
import { NavItem } from "./NavItem";
import { Scale } from "lucide-react";

export function Sidebar() {
	return (
		<nav className="px-4 py-6 w-3xs sticky top-0 h-dvh sm:flex flex-col gap-4 bg-sidebar-background/50 border-e border-e-sidebar-border rounded-e-md hidden">
			<div className="flex items-center gap-3 mb-5">
				<div className="p-2 flex items-center justify-center rounded-xs bg-interactive-primary">
					<Scale className="stroke-interactive-primary-foreground" />
				</div>
				<h2 className="text-h4 text-text-primary">Mizan</h2>
			</div>
			{navItems.map((i) => (
				<NavItem key={i.id} to={i.to} icon={i.icon} content={i.item}  />
			))}
		</nav>
	);
}
