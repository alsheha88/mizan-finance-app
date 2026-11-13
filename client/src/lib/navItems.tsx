import {
	LayoutDashboard,
	Wallet,
	CreditCard,
	ArrowDownLeft,
	Landmark,
	Sparkles,
	CircleUser,
	ArrowUpRight,
} from "lucide-react";

export const navItems = [
	{
		id: 1,
		item: "Dashboard",
		to: "/dashboard",
		icon: LayoutDashboard,
	},
	{
		id: 2,
		item: "Accounts",
		to: "/accounts",
		icon: Wallet,
	},
	{
		id: 3,
		item: "Income",
		to: "/income",
		icon: ArrowDownLeft,
	},
	{
		id: 4,
		item: "Expenses",
		to: "/expenses",
		icon: ArrowUpRight,
	},
	{
		id: 5,
		item: "Credit Cards",
		to: "/cards",
		icon: CreditCard,
	},
	{
		id: 6,
		item: "Loans",
		to: "/loans",
		icon: Landmark,
	},
	{
		id: 7,
		item: "Assistant",
		to: "/assistant",
		icon: Sparkles,
	},
	{
		id: 8,
		item: "Profile",
		to: "/profile",
		icon: CircleUser,
	},
];

const PRIMARY_PATHS = ["/dashboard", "/accounts", "/expenses", "/income"];

export const primaryNavItems = PRIMARY_PATHS.map(
	(path) => navItems.find((i) => i.to === path)!,
);

export const secondaryNavItems = navItems.filter(
	(i) => !PRIMARY_PATHS.includes(i.to),
);
