import { getCurrentMonth } from "@/lib/helpers";
import { useEffect, useState, type ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";

export const useTransactionsFilters = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [value, setValue] = useState("");
	const page = Number(searchParams.get("page") ?? 1);
	const search = searchParams.get("search") ?? "";
	const month = searchParams.get("month") ?? getCurrentMonth();
	const categoryId = searchParams.get("categoryId") ?? undefined;
	const accountId = searchParams.get("accountId") ?? undefined;
	const limit = 10;
	const handleChange = (id: string) => {
		setSearchParams(
			(prev) => {
				if (id === "all") {
					prev.delete("categoryId");
					prev.set("page", "1");
				} else {
					prev.set("categoryId", id);
					prev.set("page", "1");
				}

				return prev;
			},
			{ replace: true },
		);
	};
	const onPageChange = (newPage: number) => {
		setSearchParams((prev) => {
			prev.set("page", String(newPage));

			return prev;
		});
	};

	const onMonthChange = (value: string) => {
		setSearchParams(
			(prev) => {
				prev.set("month", value);

				return prev;
			},
			{ replace: true },
		);
	};
	const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			setSearchParams(
				(prev) => {
					if (!value) {
						prev.delete("search");
					} else {
						prev.set("search", value);
					}
					prev.set("page", "1");
					return prev;
				},
				{ replace: true },
			);
		}, 300);
		return () => {
			clearTimeout(timer);
		};
	}, [value]);

	return {
		page,
		limit,
		month,
		search,
		value,
		categoryId,
		accountId,
		handleChange,
		onSearch,
		onMonthChange,
		onPageChange,
	};
};
