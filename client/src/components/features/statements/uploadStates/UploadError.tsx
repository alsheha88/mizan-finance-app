import { Button } from "@/components/primitives/Button";
import { TriangleAlert } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import {
	FilePicker,
	formatFileSize,
	UploadBox,
	UploadStateLayout,
} from "./UploadStateLayout";

type UploadErrorProps = {
	message: string;
	onClose: () => void;
	onUpload: () => void;
	setFile: Dispatch<SetStateAction<File | undefined>>;
	file: File | undefined;
};

function UploadError({ message, onClose, onUpload, setFile, file }: UploadErrorProps) {
	return (
		<UploadStateLayout
			footer={
				<>
					<Button type="button" variant="secondary" onClick={onClose}>
						Cancel
					</Button>
					<Button type="button" onClick={onUpload} disabled={!file}>
						Try again
					</Button>
				</>
			}>
			<UploadBox>
				<TriangleAlert
					className="size-10 stroke-interactive-destructive stroke-1"
					aria-hidden
				/>
				<h4 className="text-h4 text-text-primary">Couldn't read this file</h4>
				<p className="text-body-sm text-text-secondary">{message}</p>
				{file && (
					<p className="text-label-md text-text-primary break-all">
						{file.name} · {formatFileSize(file.size)}
					</p>
				)}
				<FilePicker label="Choose another file" setFile={setFile} />
			</UploadBox>
		</UploadStateLayout>
	);
}

export default UploadError;