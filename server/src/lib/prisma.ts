import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString, max: 5 });
const prisma = new PrismaClient({
	adapter,
	// Neon suspends idle computes; waking one takes longer than Prisma's
	// 2s default maxWait, which surfaced as P2028 on every transaction.
	transactionOptions: { maxWait: 15000, timeout: 20000 },
});

export { prisma };