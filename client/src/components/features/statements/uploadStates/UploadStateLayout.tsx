import type { Dispatch, ReactNode, SetStateAction } from "react";

export function UploadStateLayout({
	children,
	footer,
}: {
	children: ReactNode;
	footer: ReactNode;
}) {
	return (
		<>
			<div className="flex-1 min-h-0 flex flex-col gap-4 p-4 sm:p-6 overflow-y-auto scrollbar-track-transparent scrollbar-thumb-border-strong scrollbar-gutter-stable">
				{children}
			</div>
			<div className="shrink-0 flex items-center justify-end gap-3 px-4 py-4 sm:px-6 border-t border-border-subtle">
				{footer}
			</div>
		</>
	);
}

// The dashed box used by every state except the preview table.
export function UploadBox({ children }: { children: ReactNode }) {
	return (
		<div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-4 py-8 sm:px-8 bg-input-background border-2 border-dashed border-border-default rounded-lg">
			{children}
		</div>
	);
}

// The file chooser. The input is visually hidden but still reachable by keyboard.
export function FilePicker({
	label,
	setFile,
}: {
	label: string;
	setFile: Dispatch<SetStateAction<File | undefined>>;
}) {
	return (
		<label className="flex items-center justify-center border border-border-strong px-4 py-2.5 rounded-sm text-text-primary text-button-md hover:bg-surface-hover cursor-pointer focus-within:ring-2 focus-within:ring-ring-default">
			{label}
			<input
				type="file"
				className="sr-only"
				accept="application/pdf"
				onChange={(e) => setFile(e.target.files?.[0])}
			/>
		</label>
	);
}

export function formatFileSize(bytes: number) {
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
	return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}