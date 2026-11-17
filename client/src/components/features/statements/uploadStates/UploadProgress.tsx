import { Button } from "@/components/primitives/Button";
import { Upload } from "lucide-react";
import { UploadBox, UploadStateLayout } from "./UploadStateLayout";

function UploadProgress() {
	return (
		<UploadStateLayout
			// Same footer as the other states, so nothing jumps while uploading.
			footer={
				<Button type="button" disabled>
					Uploading…
				</Button>
			}>
			<UploadBox>
				<Upload
					className="size-10 stroke-accent-foreground stroke-1 animate-pulse"
					aria-hidden
				/>
				<h4 className="text-h4 text-text-primary" role="status">
					Reading statement…
				</h4>
				<p className="text-body-sm text-text-secondary">
					This can take a few seconds for long statements.
				</p>
			</UploadBox>
		</UploadStateLayout>
	);
}

export default UploadProgress;