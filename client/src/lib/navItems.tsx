import {
	LayoutDashboard,
	Wallet,
	DollarSign,
	TrendingDown,
	CircleDollarSign,
	UserSquare2Icon,
	CreditCard,
} from "lucide-react";

export const navItems = [
	{
		id: 1,
		item: "Dashboard",
		to: "/dashboard",
		icon: <LayoutDashboard className="text-current" />,
	},
	{
		id: 2,
		item: "Accounts",
		to: "/accounts",
		icon: <Wallet className="text-current" />,
	},
	{
		id: 3,
		item: "Income",
		to: "/income",
		icon: <CircleDollarSign className="text-current" />,
	},
	{
		id: 4,
		item: "Expenses",
		to: "/expenses",
		icon: <DollarSign className="text-current" />,
	},
	{
		id: 5,
		item: "Credit Cards",
		to: "/cards",
		icon: <CreditCard className="text-current" />,
	},
	{
		id: 6,
		item: "Loans",
		to: "/loans",
		icon: <TrendingDown className="text-current" />,
	},
	{
		id: 7,
		item: "Profile",
		to: "/profile",
		icon: <UserSquare2Icon className="text-current " />,
	},
];

// The mobile tab bar has five slots: four destinations plus "More".
// Order follows the design: Dashboard, Accounts, Expenses, Income.
const PRIMARY_PATHS = ["/dashboard", "/accounts", "/expenses", "/income"];

export const primaryNavItems = PRIMARY_PATHS.map(
	(path) => navItems.find((i) => i.to === path)!,
);

export const secondaryNavItems = navItems.filter(
	(i) => !PRIMARY_PATHS.includes(i.to),
);
