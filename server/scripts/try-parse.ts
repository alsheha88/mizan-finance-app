const descriptions = [
	"To Account 281290123382 - انترنت - مالى تحويل",

	"Invoice No. 64458497 - التجارية قسط",

	"- واردة مالية حواالت WLC004L2HG,NBOKKW,KW88NBOK0000000000001007717030,GULF INSURANCE AND REINSURANCE CO K",

	"To Account 281290123382 - انترنت - مالى تحويل",

	"- أموال إستالم - ومض تحويل 20260515BBYN001O021749297500447470|OTHMAN ABDULSALAM MOHAMMAD ALDUWAILAH-|BBYN|Bill Payment",

	"Invoice No. 64376093 - التجارية قسط",

	"Invoice No. 64342503 - 1 inst - انترنت تجارية- قسط سداد",

	"Invoice No. 64474435 - التجارية قسط",

	"Invoice No. 64298647 - 1 inst - انترنت تجارية- قسط سداد",

	"Invoice No. 64376093 - 1 inst - انترنت تجارية- قسط سداد",

	"Invoice No. 64298647 - التجارية قسط",

	"20260916BBYN001O021508274400376535|MANAL - أموال إستالم - ومض تحويل OTHMAN MOHAMMAD ALQATI-51090230|BBYN|Misc. fees and Charges",

	"20260918KFH001O020923026700077266|MANAL - أموال إرسال - ومض تحويل O***N M***D A***I-51090230|BBYN|Bill Payment",

	"20260918BBYN001O020921206300125357|MANAL - أموال إستالم - ومض تحويل OTHMAN MOHAMMAD ALQATI-51090230|BBYN|Gift",

	"المرضى اعانة صندوق Recurring-جمعية - 42962 - دائم دفع أمر",

	"Invoice No. 64458497 - التجارية قسط",

	"Invoice No. 64298647 - التجارية قسط",

	"20260823BBYN001O021552571300561012|MANAL - أموال إستالم - ومض تحويل OTHMAN MOHAMMAD ALQATI-51090230|BBYN|Bill Payment",

	"To Account 281290123382 - انترنت - مالى تحويل",

	"VISA/MSC Card No:4790450000005687 - إئتمان بطاقة",
];

// server/scripts/try-parse.ts
import { readFileSync } from "node:fs";
import { parseAccountStatement } from "../src/parser/accountStatementParser";
import { getMerchant, getRowType } from "../src/lib/helpers";

const bytes = new Uint8Array(
	readFileSync("../server/src/sample/AccountStatementActive.pdf"),
);

const rows = await parseAccountStatement(bytes);
console.table(
	rows.map((r) => {
		const rowType = getRowType(r.description);
		return {
			rowType,
			merchant: getMerchant(r.description, rowType),
			description: r.description,
		};
	}),
);


