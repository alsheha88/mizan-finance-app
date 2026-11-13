import { navItems } from "@/lib/navItems";
import { NavItem } from "./NavItem";
import { Scale } from "lucide-react";

export function Sidebar() {
	return (
		<aside className="px-4 py-6 w-56 lg:w-3xs shrink-0 sticky top-0 h-dvh hidden md:flex flex-col gap-4 border-e border-e-sidebar-border">
			<div className="flex items-center gap-3 mb-6">
				<div className="p-2 flex items-center justify-center rounded-sm bg-interactive-primary">
					<Scale className="stroke-interactive-primary-foreground" />
				</div>
				<span className="text-h4 text-text-primary">Mizan</span>
			</div>
			<nav aria-label="Main">
				<ul className="flex flex-col gap-1">
					{navItems.map((i) => (
						<li key={i.id}>
							<NavItem to={i.to} icon={i.icon} content={i.item} />
						</li>
					))}
				</ul>
			</nav>
		</aside>
	);
}
