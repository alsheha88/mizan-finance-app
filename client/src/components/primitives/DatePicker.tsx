import { DayPicker } from "@daypicker/react";
import { useState, type SetStateAction } from "react";

type DatePickerProps = {
	month: Date;
	setMonth: React.Dispatch<SetStateAction<Date>>;
};

export function DatePicker() {
	const [selected, setSelected] = useState<Date>();
	const [month, setMonth] = useState<Date>(new Date());

	return (
		<DayPicker
			navLayout="around"
			mode="single"
			selected={selected}
			onSelect={setSelected}
			month={month}
			onMonthChange={setMonth}
			className="max-w-sm p-4 bg-popover-default border border-border-default rounded-md "
			classNames={{
				chevron: "stroke-text-secondary fill-text-secondary h-4 w-4",
				month:
					"grid grid-cols-[auto_1fr_auto] text-center items-center gap-y-4 text-text-primary",
				caption_label: "col-start-2 row-start-1 text-center",
				today:
					"[&:not(.is-selected)>button]:text-interactive-primary [&>button]:border [&>button]:border-interactive-primary",
				selected:
					"overflow-hidden is-selected [&>button]:bg-interactive-primary [&>button]:text-interactive-primary-foreground",
				button_next:
					"col-start-3 row-start-1 rounded-sm p-2 border border-border-default",
				button_previous:
					"col-start-1 row-start-1 rounded-sm p-2 border border-border-default",
				month_grid: "col-span-3 row-start-2",
				day: "w-10 h-10 p-0",
				day_button:
					"cursor-pointer w-full h-full rounded-sm text-body-sm flex items-center justify-center",
				weekday: "text-text-tertiary text-caption-sm",
			}}></DayPicker>
	);
}
