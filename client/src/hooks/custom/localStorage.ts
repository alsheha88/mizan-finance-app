import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
	const [value, setValue] = useState(() => {
		try {
			const saved = localStorage.getItem(key);

			return saved ? JSON.parse(saved) : initialValue;
		} catch {
			return initialValue;
		}
	});
	useEffect(() => {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (err) {
			console.warn(err);
		}
	}, [value, key]);

	return [value, setValue] as [T, React.Dispatch<React.SetStateAction<T>>];
}
