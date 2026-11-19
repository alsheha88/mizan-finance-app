import { useUploadAccountStatement } from "@/hooks/uploadStatement";
import type { Account } from "@/schema/accountsSchema";
import { useState } from "react";
import UploadDropZone from "../statements/uploadStates/UploadDropZone";
import UploadError from "../statements/uploadStates/UploadError";
import UploadProgress from "../statements/uploadStates/UploadProgress";
import { capitalizeFirstLetter } from "@/lib/helpers";
import { getApiErrorMessage } from "@/lib/api";
import UploadPreview from "../statements/uploadStates/UploadPreview";
import { FormDialog } from "@/components/primitives/FormDialog";

type UploadStatementModalProps = {
	account: Account;
	onClose: () => void;
};

function UploadStatementModal({
	account,
	onClose,
}: UploadStatementModalProps) {
	const { mutate, data, isError, isSuccess, isPending, error } =
		useUploadAccountStatement();
	const [file, setFile] = useState<File | undefined>(undefined);

	const handleUpload = () => {
		if (!file) return;

		mutate(
			{ accountId: account.id, file: file },
			
		);
	};

	return (
		<FormDialog
			title="Upload statement"
			description={`${capitalizeFirstLetter(account.name)} account`}
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

export default UploadStatementModal;
