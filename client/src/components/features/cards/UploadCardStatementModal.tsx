import { useState } from "react";
import UploadProgress from "../statements/uploadStates/UploadProgress";
import UploadError from "../statements/uploadStates/UploadError";
import UploadDropZone from "../statements/uploadStates/UploadDropZone";
import UploadPreview from "../statements/uploadStates/UploadPreview";
import { useUploadCardStatement } from "@/hooks/uploadStatement";
import { getApiErrorMessage } from "@/lib/api";
import type { CreditCard } from "@/schema/creditCardsSchema";
import { capitalizeFirstLetter } from "@/lib/helpers";

type UploadCardStatementModalProps = {
	card: CreditCard;
	onClose: () => void;
};

function UploadCardStatementModal({
	card,
	onClose,
}: UploadCardStatementModalProps) {
	const [file, setFile] = useState<File | undefined>(undefined);

	const { mutate, data, isError, isPending, isSuccess, error } =
		useUploadCardStatement();

	const handleUpload = () => {
		if (!file) return;

		mutate({ creditCardId: card.id, file: file });
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<div className="rounded-xl border border-border-default bg-popover-default w-full max-w-2xl max-h-[85vh] flex flex-col">
				<div className="flex flex-col gap-1 p-6 border-b border-b-border-subtle">
					<h3 className="text-h3 text-text-primary">Upload Statement</h3>
					<p className="text-caption-md text-text-tertiary">
						{capitalizeFirstLetter(card.name)} Card
					</p>
				</div>
				{!isPending && !isError && !isSuccess && (
					<UploadDropZone
						file={file}
						setFile={setFile}
						onUpload={handleUpload}
						onClose={onClose}
					/>
				)}
				{isError && (
					<UploadError
						message={getApiErrorMessage(error)}
						onClose={onClose}
						onUpload={handleUpload}
						file={file}
						setFile={setFile}
					/>
				)}
				{isPending && <UploadProgress />}
				{isSuccess && (
					<UploadPreview transactions={data} onClose={onClose} />
				)}
			</div>
		</div>
	);
}

export default UploadCardStatementModal;
