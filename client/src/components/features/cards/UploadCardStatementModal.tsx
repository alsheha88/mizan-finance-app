import { useState } from "react";
import UploadProgress from "../statements/uploadStates/UploadProgress";
import UploadError from "../statements/uploadStates/UploadError";
import UploadDropZone from "../statements/uploadStates/UploadDropZone";
import UploadPreview from "../statements/uploadStates/UploadPreview";
import { useUploadCardStatement } from "@/hooks/uploadStatement";
import { getApiErrorMessage } from "@/lib/api";
import type { CreditCard } from "@/schema/creditCardsSchema";
import { capitalizeFirstLetter } from "@/lib/helpers";
import { FormDialog } from "@/components/primitives/FormDialog";

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
		<FormDialog
			title="Upload statement"
			description={`${capitalizeFirstLetter(card.name)} card`}
			onClose={onClose}
			canClose={!isPending}
			size="lg"
			padded={false}
			// Same height in every upload state, so the dialog doesn't jump between them.
			className="min-h-[min(30rem,85dvh)]">
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
					<UploadPreview
						transactions={data.transactions}
						onClose={onClose}
						skipped={data.skipped}
					/>
				)}
		</FormDialog>
	);
}

export default UploadCardStatementModal;
