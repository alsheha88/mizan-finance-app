import { navGroups } from "@/lib/navItems";
import { NavItem } from "./NavItem";
import { Logo } from "./Logo";

export function Sidebar() {
	return (
		<aside className="px-4 py-6 w-56 lg:w-3xs shrink-0 sticky top-0 h-dvh hidden md:flex flex-col gap-4 border-e border-e-sidebar-border">
			<Logo className="mb-6" />
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
