import { navGroups } from "@/lib/navItems";
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
			<nav aria-label="Main" className="flex-1 min-h-0 overflow-y-auto">
				<ul className="flex flex-col gap-4">
					{navGroups.map((group) => (
						<li key={group.label} className="flex flex-col gap-1">
							<p
								id={`nav-${group.label}`}
								className="text-label-md text-text-tertiary tracking-widest uppercase">
								{group.label}
							</p>
							<ul aria-labelledby={`nav-${group.label}`} className="flex flex-col gap-1">
								{group.items.map((item) => (
									<li key={item.to}>
										<NavItem to={item.to} icon={item.icon} content={item.item} />
									</li>
								))}
							</ul>
						</li>
					))}
				</ul>
			</nav>
		</aside>
	);
}
