import Badge from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { Input } from "@/components/primitives/Input";
import { useCreateCategory } from "@/hooks/categories";
import { capitalizeFirstLetter } from "@/lib/helpers";
import type { Category } from "@/schema/categoriesSchema";
import type { TransactionType } from "@/schema/enums";
import { useState, type ChangeEvent } from "react";

type CategoryListProps = {
	title: string;
	appliesTo: TransactionType;
	categories: Category[];
};

function CategoryList({ title, appliesTo, categories }: CategoryListProps) {
	const [isAdding, setIsAdding] = useState(false);
	const [name, setName] = useState("");
	const { mutate: createCategory } = useCreateCategory();

	const onChange = (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value);

	const close = () => {
		setIsAdding(false);
		setName("");
	};

	const save = () => {
		const trimmed = name.trim();
		if (!trimmed) return close();
		createCategory({ name: trimmed, appliesTo }, { onSuccess: close });
	};

	return (
		<div className="grid gap-3">
			<p className="text-text-secondary text-label-lg">{title}</p>
			<div className="flex items-center gap-2 flex-wrap">
				{categories.map((c) => (
					<Badge key={c.id} color={c.color}>
						{capitalizeFirstLetter(c.name)}
					</Badge>
				))}
				{isAdding ? (
					<Input
						type="text"
						autoFocus
						className="w-40 px-2.5 py-1 text-label-sm"
						value={name}
						aria-label={`New ${title.toLowerCase()} category`}
						onChange={onChange}
						onBlur={close}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								save();
							} else if (e.key === "Escape") {
								close();
							}
						}}
					/>
				) : (
					<Button
						variant="ghost"
						type="button"
						className="px-2.5 py-1 border-1 border-dashed border-border-default hover:bg-transparent text-text-secondary"
						size="sm"
						onClick={() => setIsAdding(true)}>
						+ Add category
					</Button>
				)}
			</div>
		</div>
	);
}

export default CategoryList;
