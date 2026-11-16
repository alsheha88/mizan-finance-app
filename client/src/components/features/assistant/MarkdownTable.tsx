import type { ComponentProps } from "react";
import type { ExtraProps } from "react-markdown";

type Props = ComponentProps<"table"> & ExtraProps;

function MarkdownTable({ node: _node, ...props }: Props) {
	return (
		<div className="overflow-x-auto my-3">
			<table {...props} />
		</div>
	);
}

export default MarkdownTable;
