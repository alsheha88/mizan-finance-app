import { useUploadAccountStatement } from "@/hooks/uploadStatement";
import type { Account } from "@/schema/accountsSchema";
import { useState } from "react";
import UploadDropZone from "../statements/uploadStates/UploadDropZone";
import UploadError from "../statements/uploadStates/UploadError";
import UploadProgress from "../statements/uploadStates/UploadProgress";
import { capitalizeFirstLetter } from "@/lib/helpers";
import { getApiErrorMessage } from "@/lib/api";
import UploadPreview from "../statements/uploadStates/UploadPreview";

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
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-overlay p-4">
			<div className="rounded-xl border border-border-subtle bg-card-default shadow-overlay w-full max-w-2xl max-h-[85vh] flex flex-col">
				<div className="flex flex-col gap-1 p-6 border-b border-b-border-subtle">
					<h3 className="text-h3 text-text-primary">Upload Statement</h3>
					<p className="text-caption-md text-text-tertiary">
						{capitalizeFirstLetter(account.name)} Account
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
					<UploadPreview
						transactions={data.transactions}
						onClose={onClose}
						skipped={data.skipped}
					/>
				)}
			</div>
		</div>
	);
}

export default UploadStatementModal;
