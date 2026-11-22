import { useState, useEffect } from "react";

export const useDebouncedValue = (value: number, delay: number = 400) => {
	const [settledvalue, setSettledValue] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => {
			setSettledValue(value);
		}, delay);
		return () => clearTimeout(timer);
	}, [value, delay]);

	return settledvalue;
};
