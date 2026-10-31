# Refactor & follow-up work

Running list of known issues and deferred decisions. Each entry says where and what.

## Backend — correctness

- **`server/src/db/functions/dashboard.ts` → `dbGetCashflow`** ignores the `month`
  query param. It is hardcoded to the six calendar months ending *today*, so any
  month-over-month comparison derived from `cashflow` is only correct while the
  user is viewing the current month. If a month picker is added to the Accounts
  or Dashboard page, the percentages will silently describe the wrong months.
  Fix: accept `month` and build the six-month window ending at that month.

- **Statement upload has no ownership guard.** `uploadAccountStatement` trusts the
  `accountId` in the body and never checks that the PDF actually belongs to that
  account. Uploading account A's statement against account B silently imports it.
  Fix: have the parser return `{ accountNumber, rows }`, compare against the
  account record, throw `ConflictError` (409) on mismatch, and reject when the
  account number can't be extracted. Same for card statements.

- **`server/src/db/functions/transactions.ts` → `dbCreateTransaction`** returns only
  the created rows, so re-uploading an already-imported statement returns `[]`
  and the upload modal's success state renders an empty table with no
  explanation. Return `{ created, skipped }` and have the controller pass both
  through, so the UI can say "208 already imported, nothing new".

- **Decision parked: confirm-before-commit vs single-shot upload.** Today
  `POST /statement/upload` parses *and* writes in one request, so the success
  table is a result, not a preview. A real confirm step needs
  `POST /statement/parse` (returns rows + a short-lived previewId, writes
  nothing) and `POST /statement/commit` (takes the previewId). Undo is the worse
  option here: `dbMatchTransactionToLoan`, `dbAccountToAccountTransfers` and
  `dbMatchCardPayments` all mutate rows from *previous* imports, so deleting a
  batch leaves orphaned transfer pairs and loan links. Re-decide after the
  ownership guard lands — it already prevents the damaging mistakes.

- **`server/src/schema/transactionsSchema.ts` → `updatedTransactionSchema`**: every
  field is `.optional()` and `dbUpdateTransaction` filters out `undefined`, so
  there is no way to *clear* a value — a category can't be removed and a note
  can't be deleted. Needs `.nullable()` on those fields plus letting `null`
  through the filter, if that behaviour is wanted. Product decision.

- **`transferGroupId` pairing is untested.** `dbAccountToAccountTransfers` has never
  run against a real matching pair; needs account 4300's statement to verify.

- **`CardTransaction` has no `@@unique`**, so re-uploading a card statement inserts
  every row again with no skip and no error. The account-side key works because
  `balanceAfter` differs on every row; card statements have no running balance,
  so `[creditCardId, transactionDate, amount, description]` would wrongly collapse
  two genuinely separate same-day purchases at the same merchant for the same
  amount — a pattern that occurs in real statements. Likely needs statement-period
  tracking per card rather than per-row dedup. Design decision, deferred.

## Backend — categorisation (Phase 2 remainder)

- **`server/src/lib/pdfConfig.ts`**: `"5999": "shopping"` is wrong — Taly is BNPL,
  not retail. Comment it out, same as `4829`.
- Add an `installments` / BNPL category and seed merchant-memory entries for
  deemaKW, Tabby and Taly. `4829` and `5999` can't be categorised by MCC alone
  because the aggregator hides the real merchant.
- Optional: map `7523` (parking) to a new `transport` category — currently
  commented out in `MCC_CATEGORIES`.
- **`server/src/lib/pdfConfig.ts` → `ROW_TYPE_LABELS`**: `debit_card_purchase: "KNET"`
  is inaccurate for the US/IE/OM/SG/AU Electron rows. "Card Purchase" is correct
  for all of them.
- Merchant memory model + resolution order + re-categorise endpoint — needs the
  frontend first.

## Backend — tidy

- **`server/src/controllers/uploadStatement.ts:24`**: `console.log("UPLOAD HANDLER v2")`
  debug line from the stale-dev-server investigation.
- **`server/src/controllers/user.ts:53`**: signup responds with `{ data: { newUser } }`.
  Every other handler uses the resource's own name. Rename to `user` (and update
  `client/src/api/auth.ts` in the same change).

## Frontend — types & structure

- **`client/src/schema/transactionsSchema.ts`**: `TransactionListItem` and
  `Transaction` each repeat the same 18 columns, and `TransactionResponse` is
  that base shape already. Derive:
  `TransactionListItem = TransactionResponse & { category }` and
  `Transaction = TransactionListItem & { loan; creditCard }`.
- **`client/src/schema/transactionsSchema.ts`**: `CardTransactionResponse` lives in
  the wrong file — it belongs in `creditCardsSchema.ts` next to `CardTransaction`,
  with `CardTransaction = CardTransactionResponse & { category }`.
- **`client/src/schema/userSchema.ts`**: `IdParams` is imported by accounts,
  categories, transactions, cards and loans. Move to a shared schema file.
- **`client/src/components/primitives/Select.tsx`**: props need `| undefined`
  (exactOptionalPropertyTypes), which then allows deleting the
  `{...(value !== undefined && { value })}` conditional spreads. Same for
  `DatePicker` when it's wired to React Hook Form.

## Frontend — cache & conventions

- **`client/src/hooks/accounts.ts`**: detail query key is `["account", id]`
  (singular) while the list is `["accounts"]`. Change to `["accounts", id]` so
  prefix matching invalidates both with one call, then drop the second
  `invalidateQueries({ queryKey: ["account"] })` from `useEditAccount` and
  `useUpdateAccountActiveStatus`.
- **`client/src/hooks/user.ts`**: query key is `["me"]`, which doesn't follow the
  `["<resource>"]` convention used everywhere else. Rename to `["user"]` or
  deliberately keep it as the exception.
- **`client/src/hooks/accounts.ts` → `useGetAccount(id: string)`**: when a detail
  route exists, `useParams` gives `string | undefined`. Type the param that way
  and add `enabled: !!id` rather than asserting with `!` at the call site.

## Frontend — design system

- Hardcoded colours bypass the token layer in `index.css` and won't follow dark
  mode: the spinner's `color="#10b77f"` in `PrivateRoute` / `PublicRoute`, and the
  `Toaster` `hsla(...)` values in `main.tsx`. Read them from CSS variables, or
  wrap the spinner in a `Spinner` primitive that does.

## Frontend — minor

- **`client/src/api/transactions.ts` → `getTransactions`**: destructures all seven
  params then rebuilds an identical object. `(params: TransactionsOptions)` passed
  straight to `{ params }` is the same call with less to keep in sync.
- Missing primitives, to build when a screen needs them: Skeleton, Tabs,
  Checkbox/Toggle.
