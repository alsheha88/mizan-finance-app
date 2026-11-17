import { Button } from "@/components/primitives/Button";
import { Upload } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import {
	FilePicker,
	formatFileSize,
	UploadBox,
	UploadStateLayout,
} from "./UploadStateLayout";

type UploadDropZoneProps = {
	setFile: Dispatch<SetStateAction<File | undefined>>;
	file: File | undefined;
	onUpload: () => void;
	onClose: () => void;
};

function UploadDropZone({ setFile, file, onUpload, onClose }: UploadDropZoneProps) {
	return (
		<UploadStateLayout
			footer={
				<>
					<Button type="button" variant="secondary" onClick={onClose}>
						Cancel
					</Button>
					<Button type="button" onClick={onUpload} disabled={!file}>
						Upload
					</Button>
				</>
			}>
			<UploadBox>
				<Upload className="size-10 stroke-text-tertiary stroke-1" aria-hidden />
				<h4 className="text-h4 text-text-primary">Upload your statement</h4>
				<p className="text-body-sm text-text-secondary">
					PDF statement from your bank · max 10 MB
				</p>
				{file && (
					<p className="text-label-md text-text-primary break-all">
						{file.name} · {formatFileSize(file.size)}
					</p>
				)}
				<FilePicker label={file ? "Choose another file" : "Choose file"} setFile={setFile} />
			</UploadBox>
		</UploadStateLayout>
	);
}

export default UploadDropZone;