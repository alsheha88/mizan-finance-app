import { hashPassword } from "../lib/authHelpers.js";
import { prisma } from "../lib/prisma.js";

export const main = async () => {
	const seedUserPassword = await hashPassword("password123");

	const user = await prisma.user.create({
		data: {
			fullName: "Abdulaziz",
			passwordHash: seedUserPassword,
			email: "alsheha88@hotmail.com",
		},
	});
	const account = await prisma.account.create({
		data: {
			name: "Main Checking",
			accountType: "checking",
			userId: user.id,
			accountNumber: "0072",
		},
	});

	console.log(`${account} & ${user} seeded successfully`);
};

try {
	await main();
} catch (e) {
	console.error({ err: e }, "Seed failed");
	process.exit(1);
} finally {
	await prisma.$disconnect();
}
