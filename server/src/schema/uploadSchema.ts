import z from "zod";

export const accountIdSchema = z.object({
    accountId: z.uuid()
})


export type AccountId = z.infer<typeof accountIdSchema>