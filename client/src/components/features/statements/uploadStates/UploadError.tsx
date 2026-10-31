import { Button } from "@/components/primitives/Button";
import { TriangleAlert } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

type UploadErrorProps = {
	message: string;
	onClose: () => void;
	onUpload: () => void;
	setFile: Dispatch<SetStateAction<File | undefined>>;
	file: File | undefined;
};

function UploadError({
	message,
	onClose,
	onUpload,
	setFile,
	file,
}: UploadErrorProps) {
	return (
		<>
			<div className="flex items-center justify-center p-4 sm:p-6 border-b border-b-border-subtle">
				<div className="w-full grid place-items-center gap-3 px-4 py-6 sm:px-8 sm:py-10 bg-input-background border-2 border-dashed border-border-default rounded-lg">
					<TriangleAlert className="w-10 h-10 stroke-interactive-destructive stroke-1" />
					<h4 className="text-h4 text-text-primary">Couldn't read this file</h4>
					<p className="text-body-sm text-text-secondary">{message}</p>
					{file && (
						<p className="text-label-md text-text-primary">
							{file.name} - {file.size.toFixed(1)} Bytes
						</p>
					)}
					<label className="flex items-center justify-center border border-border-strong px-4 py-3 rounded-md text-text-primary text-button-md hover:bg-surface-hover active:scale-[95%] cursor-pointer">
						Try another file
						<input
							type="file"
							className="hidden"
							accept="application/pdf"
							onChange={(e) => setFile(e.target.files?.[0])}
						/>
					</label>
				</div>
			</div>
			<div className="p-6 flex items-center gap-4 place-self-end">
				<Button
					type="button"
					variant="secondary"
					onClick={onClose}>
					Cancel
				</Button>
				<Button type="button" onClick={onUpload}>
					Upload
				</Button>
			</div>
		</>
	);
}

export default UploadError;
