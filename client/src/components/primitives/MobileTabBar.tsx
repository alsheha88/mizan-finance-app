import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Ellipsis } from "lucide-react";
import { cn } from "@/lib/cn";
import { primaryNavItems, secondaryNavItems } from "@/lib/navItems";
import { Drawer } from "./Drawer";
import { NavItem } from "./NavItem";

const slot =
	"flex flex-col items-center justify-center gap-1 flex-1 py-2 text-caption-sm";

export function MobileTabBar() {
	const [isMoreOpen, setIsMoreOpen] = useState(false);

	return (
		<>
			<nav
				aria-label="Main"
				className="md:hidden fixed bottom-0 inset-x-0 z-40 flex items-stretch bg-bg-primary border-t border-t-sidebar-border pb-[env(safe-area-inset-bottom)]">
				{primaryNavItems.map((i) => (
					<NavLink
						key={i.id}
						to={i.to}
						className={({ isActive }) =>
							cn(
								slot,
								isActive
									? "text-interactive-primary"
									: "text-sidebar-foreground",
							)
						}>
						{<i.icon size={22} aria-hidden />}
						{i.item}
					</NavLink>
				))}

				<button
					type="button"
					aria-haspopup="dialog"
					aria-expanded={isMoreOpen}
					onClick={() => setIsMoreOpen(true)}
					className={cn(
						slot,
						"cursor-pointer",
						isMoreOpen ? "text-interactive-primary" : "text-sidebar-foreground",
					)}>
					<Ellipsis className="text-current" />
					More
				</button>
			</nav>

			<Drawer
				title="More"
				isOpen={isMoreOpen}
				onOpenChange={setIsMoreOpen}
				footer={<></>}>
				<div className="grid gap-1 content-start">
					{secondaryNavItems.map((i) => (
						<NavItem
							key={i.id}
							to={i.to}
							icon={i.icon}
							content={i.item}
							onClick={() => setIsMoreOpen(false)}
						/>
					))}
				</div>
			</Drawer>
		</>
	);
}
