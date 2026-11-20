import {
	LayoutDashboard,
	Wallet,
	CreditCard,
	Landmark,
	Sparkles,
	CircleUser,
	Calendar,
	CalendarCheck2Icon,
	type LucideIcon,
	TrendingUp,
	TrendingDown,
} from "lucide-react";

export type NavItem = {
	item: string;
	to: string;
	icon: LucideIcon;
};
export const navGroups: { label: string; items: NavItem[] }[] = [
	{
		label: "Overview",
		items: [
			{
				item: "Dashboard",
				to: "/dashboard",
				icon: LayoutDashboard,
			},
			{
				item: "Cashflow Calendar",
				to: "/cashflow",
				icon: Calendar,
			},
		],
	},
	{
		label: "Money",
		items: [
			{
				item: "Accounts",
				to: "/accounts",
				icon: Wallet,
			},
			{
				item: "Income",
				to: "/income",
				icon: TrendingUp,
			},
			{
				item: "Expenses",
				to: "/expenses",
				icon: TrendingDown,
			},
		],
	},
	{
		label: "Debt",
		items: [
			{
				item: "Credit Cards",
				to: "/cards",
				icon: CreditCard,
			},
			{
				item: "Loans",
				to: "/loans",
				icon: Landmark,
			},
			{
				item: "Debt Planner",
				to: "/planner",
				icon: CalendarCheck2Icon,
			},
		],
	},
	{
		label: "Personal",
		items: [
			{
				item: "Assistant",
				to: "/assistant",
				icon: Sparkles,
			},
			{
				item: "Profile",
				to: "/profile",
				icon: CircleUser,
			},
		],
	},
];


export const navItems = navGroups.flatMap((group) => group.items)

const PRIMARY_PATHS = ["/dashboard", "/accounts", "/expenses", "/income"];

export const primaryNavItems = PRIMARY_PATHS.map(
	(path) => navItems.find((i) => i.to === path)!,
);

export const secondaryNavItems = navItems.filter(
	(i) => !PRIMARY_PATHS.includes(i.to),
);
