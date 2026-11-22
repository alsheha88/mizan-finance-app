import type { RequestHandler } from "express";
import { debtPlannerQuerySchema } from "../schema/debtPlannerSchema";
import { ValidationError } from "../../errors/errors";
import { dbGetPlannerDebts } from "../db/functions/debtPlanner";
import { planDebts } from "../lib/debtPlanner";

export const getDebtPlan: RequestHandler = async (req, res) => {
	const userId = req.user.id;
	const validateRequest = debtPlannerQuerySchema.safeParse(req.query);
	if (!validateRequest.success)
		throw new ValidationError(
			"Failed to validate query data",
			validateRequest.error.issues,
		);
	const extraFils = Math.round(validateRequest.data.extra * 1000);
	const debts = await dbGetPlannerDebts(userId);
	const plan = planDebts(debts, extraFils);
	const order = plan.order.map((i) => {
		return {
			...i,
			balance: i.balance / 1000,
		};
	});

	const planInKWD = {
		withPlan: {
			...plan.withPlan,
			totals: plan.withPlan.totals.map((i) => i / 1000),
			monthlyBudget: plan.withPlan.monthlyBudget / 1000
		},
		withoutPlan: {
			...plan.withoutPlan,
			totals: plan.withoutPlan.totals.map((i) => i / 1000),
		},
		monthsSaved: plan.monthsSaved,
		order,
	};

	res.status(200).json({ data: { plan: planInKWD } });
};
