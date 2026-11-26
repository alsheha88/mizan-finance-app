import { Link } from "react-router-dom";
import { MotionConfig, motion, type Variants } from "motion/react";
import {
	ArrowRight,
	CreditCard,
	FileUp,
	LayoutDashboard,
	Moon,
	ShieldCheck,
	Sparkles,
	Sun,
	Tags,
	Target,
} from "lucide-react";
import { Logo } from "@/components/primitives/Logo";
import { buttonClasses } from "@/components/primitives/Button";
import { HeroPreview } from "@/components/features/landing/HeroPreview";
import { IconButton } from "@/components/primitives/IconButton";
import { useTheme } from "@/context/ThemeContext";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
	hidden: { opacity: 0, y: 24 },
	show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const stagger: Variants = {
	hidden: {},
	show: { transition: { staggerChildren: 0.08 } },
};

// Full class strings (not built from parts) so Tailwind can find them.
const features = [
	{
		icon: FileUp,
		title: "Statement import",
		text: "Drop in your KFH bank or credit card statement. Mizan reads every row, in Arabic and English.",
		chip: "bg-palette-orange text-palette-orange-fg",
	},
	{
		icon: Tags,
		title: "Categories that learn",
		text: "Fix a category once and Mizan remembers the merchant, so the next statement sorts itself.",
		chip: "bg-palette-mint text-palette-mint-fg",
	},
	{
		icon: LayoutDashboard,
		title: "Monthly dashboard",
		text: "Income, spending and cash flow for any month, and the categories that took the most.",
		chip: "bg-palette-sky text-palette-sky-fg",
	},
	{
		icon: CreditCard,
		title: "Cards and loans",
		text: "Balances, limits and instalments for every card and financing contract, in one place.",
		chip: "bg-palette-violet text-palette-violet-fg",
	},
	{
		icon: Target,
		title: "Debt planner",
		text: "See when you'll be debt-free, which debt to clear first, and how much sooner an extra amount gets you there.",
		chip: "bg-palette-amber text-palette-amber-fg",
	},
	{
		icon: Sparkles,
		title: "AI assistant",
		text: "Ask about your money in plain language and get answers from your own transactions.",
		chip: "bg-palette-pink text-palette-pink-fg",
	},
];

const steps = [
	{
		title: "Create your account",
		text: "Sign up in a minute. Add your accounts, cards and loans whenever you're ready.",
	},
	{
		title: "Upload a statement",
		text: "Download the PDF from your bank app and drop it into Mizan. No bank passwords, no bank connection.",
	},
	{
		title: "See the full picture",
		text: "Your dashboard, categories and debt plan update from the statement straight away.",
	},
];

function Landing() {
	const { theme, toggleTheme } = useTheme();

	return (
		<MotionConfig reducedMotion="user">
			<div className="relative min-h-dvh overflow-x-clip bg-bg-primary text-text-primary">
				{/* Background glow */}
				<div className="pointer-events-none absolute -top-48 end-[-12rem] size-[40rem] rounded-full bg-interactive-primary/15 blur-3xl" />
				<div className="pointer-events-none absolute top-[28rem] start-[-14rem] size-[34rem] rounded-full bg-chart-indigo/10 blur-3xl" />

				<header className="sticky top-0 z-30 border-b border-border-subtle bg-bg-primary/80 backdrop-blur-md">
					<div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
						<Link to="/" aria-label="Mizan home">
							<Logo markSize={36} />
						</Link>
						<nav aria-label="Landing" className="hidden items-center gap-1 md:flex">
							<a href="#features" className={buttonClasses("ghost", "sm")}>
								Features
							</a>
							<a href="#how-it-works" className={buttonClasses("ghost", "sm")}>
								How it works
							</a>
						</nav>
						<div className="flex items-center gap-2">
							<IconButton
								label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
								icon={theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
								onClick={toggleTheme}
								className="border-transparent"
							/>
							<Link to="/login" className={buttonClasses("ghost", "md", "hidden sm:inline-flex")}>
								Sign in
							</Link>
							<Link to="/signup" className={buttonClasses("primary", "md")}>
								Get started
							</Link>
						</div>
					</div>
				</header>

				<main className="relative">
					{/* Hero */}
					<section className="mx-auto grid max-w-6xl items-center gap-14 px-5 pt-16 pb-20 lg:grid-cols-2 lg:gap-10 lg:pt-24 lg:pb-28">
						<motion.div variants={stagger} initial="hidden" animate="show">
							<motion.p
								variants={fadeUp}
								className="inline-flex items-center gap-2 rounded-full border border-border-default bg-card-default px-3 py-1 text-label-md text-text-secondary">
								<span className="size-1.5 rounded-full bg-interactive-primary" />
								Built for Kuwait · KFH statements in Arabic and English
							</motion.p>
							<motion.h1
								variants={fadeUp}
								className="mt-6 text-display-sm sm:text-display-md lg:text-display-lg">
								Your money,{" "}
								<span className="whitespace-nowrap text-interactive-primary">in balance.</span>
							</motion.h1>
							<motion.p
								variants={fadeUp}
								className="mt-5 max-w-xl text-body-lg text-text-secondary">
								Upload your bank and card statements. Mizan sorts every transaction,
								keeps your cards and loans in view, and plans the fastest way out of
								debt.
							</motion.p>
							<motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
								<Link to="/signup" className={buttonClasses("primary", "lg", "group")}>
									Get started
									<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
								</Link>
								<Link to="/login" className={buttonClasses("secondary", "lg")}>
									I have an account
								</Link>
							</motion.div>
							<motion.p
								variants={fadeUp}
								className="mt-6 flex items-center gap-2 text-caption-lg text-text-tertiary">
								<ShieldCheck className="size-4" />
								No bank login needed. You choose what to upload.
							</motion.p>
						</motion.div>

						<HeroPreview />
					</section>

					{/* Features */}
					<section id="features" className="scroll-mt-20 border-t border-border-subtle">
						<div className="mx-auto max-w-6xl px-5 py-20 lg:py-24">
							<motion.div
								variants={stagger}
								initial="hidden"
								whileInView="show"
								viewport={{ once: true, amount: 0.3 }}
								className="max-w-2xl">
								<motion.p
									variants={fadeUp}
									className="text-label-md uppercase tracking-widest text-interactive-primary">
									Features
								</motion.p>
								<motion.h2 variants={fadeUp} className="mt-3 text-h1">
									Everything your statement knows, finally readable.
								</motion.h2>
								<motion.p variants={fadeUp} className="mt-4 text-body-md text-text-secondary">
									Mizan turns long bank PDFs into a clear picture of where your money goes
									and what you owe.
								</motion.p>
							</motion.div>

							<motion.ul
								variants={stagger}
								initial="hidden"
								whileInView="show"
								viewport={{ once: true, amount: 0.15 }}
								className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{features.map((feature) => (
									<motion.li
										key={feature.title}
										variants={fadeUp}
										whileHover={{ y: -4 }}
										className="rounded-xl border border-border-subtle bg-card-default p-6 shadow-card transition-colors hover:border-border-default">
										<span
											className={`flex size-10 items-center justify-center rounded-md ${feature.chip}`}>
											<feature.icon className="size-5" />
										</span>
										<h3 className="mt-5 text-h4 text-text-primary">{feature.title}</h3>
										<p className="mt-2 text-body-sm text-text-secondary">{feature.text}</p>
									</motion.li>
								))}
							</motion.ul>
						</div>
					</section>

					{/* How it works */}
					<section id="how-it-works" className="scroll-mt-20 border-t border-border-subtle">
						<div className="mx-auto max-w-6xl px-5 py-20 lg:py-24">
							<motion.div
								variants={stagger}
								initial="hidden"
								whileInView="show"
								viewport={{ once: true, amount: 0.3 }}
								className="max-w-2xl">
								<motion.p
									variants={fadeUp}
									className="text-label-md uppercase tracking-widest text-interactive-primary">
									How it works
								</motion.p>
								<motion.h2 variants={fadeUp} className="mt-3 text-h1">
									From PDF to plan in three steps.
								</motion.h2>
							</motion.div>

							<motion.ol
								variants={stagger}
								initial="hidden"
								whileInView="show"
								viewport={{ once: true, amount: 0.2 }}
								className="mt-12 grid gap-4 md:grid-cols-3">
								{steps.map((step, i) => (
									<motion.li
										key={step.title}
										variants={fadeUp}
										className="relative rounded-xl border border-border-subtle bg-card-default p-6">
										<span className="flex size-9 items-center justify-center rounded-full bg-interactive-primary text-label-lg text-interactive-primary-foreground">
											{i + 1}
										</span>
										<h3 className="mt-5 text-h4 text-text-primary">{step.title}</h3>
										<p className="mt-2 text-body-sm text-text-secondary">{step.text}</p>
									</motion.li>
								))}
							</motion.ol>
						</div>
					</section>

					{/* Call to action */}
					<section className="px-5 pb-20 lg:pb-28">
						<motion.div
							initial={{ opacity: 0, y: 24, scale: 0.98 }}
							whileInView={{ opacity: 1, y: 0, scale: 1 }}
							viewport={{ once: true, amount: 0.4 }}
							transition={{ duration: 0.6, ease }}
							className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border-default bg-card-default px-6 py-14 text-center sm:px-12">
							<div className="pointer-events-none absolute -top-32 left-1/2 size-[28rem] -translate-x-1/2 rounded-full bg-interactive-primary/20 blur-3xl" />
							<h2 className="relative text-h1 sm:text-display-sm">
								Put your money{" "}
								<span className="whitespace-nowrap text-interactive-primary">in balance.</span>
							</h2>
							<p className="relative mx-auto mt-4 max-w-lg text-body-md text-text-secondary">
								Start with one statement. It only takes a few minutes.
							</p>
							<Link
								to="/signup"
								className={buttonClasses("primary", "lg", "group relative mt-8")}>
								Create your account
								<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
							</Link>
						</motion.div>
					</section>
				</main>

				<footer className="border-t border-border-subtle">
					<div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
						<Logo markSize={28} textClassName="text-label-lg" />
						<p className="text-caption-md text-text-tertiary">
							© {new Date().getFullYear()} Mizan · Made in Kuwait
						</p>
					</div>
				</footer>
			</div>
		</MotionConfig>
	);
}

export default Landing;
