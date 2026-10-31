import { Upload } from "lucide-react";

function UploadProgress() {
	return (
		<>
			<div className="flex items-center justify-center p-4 sm:p-6 border-b border-b-border-subtle">
				<div className="w-full grid place-items-center gap-3 px-4 py-6 sm:px-8 sm:py-10 bg-input-background border-2 border-dashed border-border-default rounded-lg">
					<Upload className="w-10 h-10 stroke-accent-foreground stroke-1 animate-pulse" />
					<h4 className="text-h4 text-text-primary">Reading statement…</h4>
				</div>
			</div>
		</>
	);
}

export default UploadProgress;
