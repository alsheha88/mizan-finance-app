import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { Check, Target } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// A product illustration for the landing page, built from the app's own tokens.
// The figures are example data, not anyone's real account.

const months = [
	{ label: "Jun", income: 78, expense: 61 },
	{ label: "Jul", income: 78, expense: 70 },
	{ label: "Aug", income: 84, expense: 58 },
	{ label: "Sep", income: 78, expense: 66 },
	{ label: "Oct", income: 80, expense: 54 },
	{ label: "Nov", income: 82, expense: 49 },
];

function CountUp({ to }: { to: number }) {
	const ref = useRef<HTMLSpanElement>(null);
	const inView = useInView(ref, { once: true });
	const reduceMotion = useReducedMotion();
	const [value, setValue] = useState(0);

	useEffect(() => {
		if (!inView) return;
		if (reduceMotion) {
			setValue(to);
			return;
		}
		const controls = animate(0, to, {
			duration: 1.4,
			ease: "easeOut",
			onUpdate: setValue,
		});
		return () => controls.stop();
	}, [inView, reduceMotion, to]);

	return (
		<span ref={ref}>
			{value.toLocaleString("en-US", {
				minimumFractionDigits: 3,
				maximumFractionDigits: 3,
			})}
		</span>
	);
}

export function HeroPreview() {
	return (
		<div className="relative mx-auto w-full max-w-md lg:max-w-none" aria-hidden="true">
			{/* Main card: this month + six-month bars */}
			<motion.div
				initial={{ opacity: 0, y: 32, rotate: -1.5 }}
				animate={{ opacity: 1, y: 0, rotate: 0 }}
				transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
				className="rounded-2xl border border-border-subtle bg-card-default p-5 pb-10 shadow-raised sm:p-6 sm:pb-10">
				<div className="flex items-center justify-between">
					<p className="text-label-md uppercase tracking-widest text-text-tertiary">
						November
					</p>
					<span className="rounded-full bg-palette-mint px-2.5 py-1 text-label-sm text-palette-mint-fg">
						Statement imported
					</span>
				</div>

				<div className="mt-5 grid grid-cols-2 gap-4">
					<div>
						<p className="text-caption-md text-text-secondary">Money in</p>
						<p className="mt-1 text-h3 text-financial-gain-fg tabular-nums">
							<CountUp to={1850} />
						</p>
					</div>
					<div>
						<p className="text-caption-md text-text-secondary">Money out</p>
						<p className="mt-1 text-h3 text-financial-loss-fg tabular-nums">
							<CountUp to={1236.45} />
						</p>
					</div>
				</div>

				<div className="mt-6 flex h-36 items-end gap-3">
					{months.map((month, i) => (
						<div key={month.label} className="flex flex-1 flex-col items-center gap-2">
							<div className="flex h-28 w-full items-end justify-center gap-1">
								<motion.div
									initial={{ scaleY: 0 }}
									animate={{ scaleY: 1 }}
									transition={{ duration: 0.7, delay: 0.6 + i * 0.08, ease: "easeOut" }}
									style={{ height: `${month.income}%`, originY: 1 }}
									className="w-2.5 rounded-t-sm bg-chart-emerald"
								/>
								<motion.div
									initial={{ scaleY: 0 }}
									animate={{ scaleY: 1 }}
									transition={{ duration: 0.7, delay: 0.7 + i * 0.08, ease: "easeOut" }}
									style={{ height: `${month.expense}%`, originY: 1 }}
									className="w-2.5 rounded-t-sm bg-chart-rose"
								/>
							</div>
							<span className="text-caption-sm text-text-tertiary">{month.label}</span>
						</div>
					))}
				</div>
			</motion.div>

			{/* Debt planner card, overlapping the bottom edge */}
			<motion.div
				initial={{ opacity: 0, y: 24 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
				className="relative -mt-6 ms-8 rounded-xl border border-border-default bg-bg-elevated p-4 shadow-overlay sm:ms-16">
				<div className="flex items-center gap-3">
					<span className="flex size-9 items-center justify-center rounded-md bg-palette-orange text-palette-orange-fg">
						<Target className="size-5" />
					</span>
					<div className="min-w-0">
						<p className="text-label-lg text-text-primary">Debt-free by March 2028</p>
						<p className="text-caption-md text-text-secondary">
							8 months sooner with 50 KWD extra a month
						</p>
					</div>
				</div>
				<div className="mt-3 h-2 overflow-hidden rounded-full bg-bg-secondary">
					<motion.div
						initial={{ width: "0%" }}
						animate={{ width: "62%" }}
						transition={{ duration: 1.2, delay: 1.4, ease: "easeOut" }}
						className="h-full rounded-full bg-interactive-primary"
					/>
				</div>
			</motion.div>

			{/* Floating chip: merchant memory */}
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
				transition={{
					opacity: { duration: 0.5, delay: 1.6 },
					scale: { duration: 0.5, delay: 1.6 },
					y: { duration: 4, delay: 2.2, repeat: Infinity, ease: "easeInOut" },
				}}
				className="absolute -top-5 inset-e-2 flex items-center gap-2 rounded-full border border-border-default bg-bg-elevated px-3 py-1.5 shadow-overlay sm:-inset-e-4">
				<span className="flex size-5 items-center justify-center rounded-full bg-palette-mint text-palette-mint-fg">
					<Check className="size-3" />
				</span>
				<span className="text-label-sm text-text-primary">Talabat → Restaurants</span>
			</motion.div>
		</div>
	);
}
