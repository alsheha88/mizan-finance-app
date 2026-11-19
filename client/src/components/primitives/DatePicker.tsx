import { DayPicker } from "@daypicker/react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { toCalendarDate } from "@/lib/helpers";

type DatePickerProps = {
	selected: Date;
	setSelected: (date: Date) => void;
	setIsPopoverOpen: Dispatch<SetStateAction<boolean>>;

};

export function DatePicker({
	selected,
	setSelected,
	setIsPopoverOpen,
}: DatePickerProps) {
	const [month, setMonth] = useState<Date>(selected ?? new Date());

	return (
		<DayPicker
			navLayout="around"
			mode="single"
			selected={selected}
			onSelect={(date: Date) => setSelected(toCalendarDate(date))}
			month={month}
			onMonthChange={setMonth}
			fixedWeeks
			showOutsideDays
			onDayClick={() => setIsPopoverOpen(false)}
			required
			className="w-full p-4 bg-bg-elevated border border-border-default rounded-md shadow-overlay"
			classNames={{
				chevron: "stroke-text-secondary fill-text-secondary h-4 w-4",
				month:
					"grid grid-cols-[auto_1fr_auto] text-body-sm text-center items-center gap-y-4 text-text-primary",
				caption_label: "col-start-2 row-start-1 text-center",
				today:
					"[&:not(.is-selected)>button]:text-interactive-primary [&>button]:border [&>button]:border-interactive-primary",
				selected:
					"overflow-hidden is-selected [&>button]:bg-interactive-primary! [&>button]:text-interactive-primary-foreground",
				button_next:
					"col-start-3 row-start-1 rounded-sm p-2 border border-border-default cursor-pointer hover:bg-surface-active",
				button_previous:
					"col-start-1 row-start-1 rounded-sm p-2 border border-border-default cursor-pointer hover:bg-surface-active",
				month_grid: "w-full col-span-3 row-start-2",
				day: "h-10 p-0 text-center",
				day_button:
					"cursor-pointer size-10 mx-auto rounded-sm text-body-sm flex items-center justify-center hover:bg-surface-active",
				weekday: "text-text-tertiary text-caption-sm",
				outside: "text-text-tertiary"
				
			}}></DayPicker>
	);
}
