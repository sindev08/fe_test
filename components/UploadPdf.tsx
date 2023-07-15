import { DocumentIcon } from "@heroicons/react/24/solid";
import { useRef } from "react";

interface UploadPdfProps {
	onFileSelectError: any;
	onFileSelectSuccess: any;
	isPdfPicked: any;
	setIsPdfPicked: any;
	type: string;
	filePdf: any;
	name: string;
	editFile?: string;
}

export function UploadPdf({
	onFileSelectError,
	onFileSelectSuccess,
	isPdfPicked,
	setIsPdfPicked,
	type,
	name,
	filePdf,
	editFile,
}: UploadPdfProps) {
	const fileInput = useRef(null);

	const handleFileInput = (e) => {
		const file = e.target.files[0];
		if (file.type !== "application/pdf") {
			return onFileSelectError("Format file harus PDF");
		} else if (file.size > 2024000) {
			return onFileSelectError("Ukuran File Tidak boleh lebih dari 2 MB");
		} else {
			onFileSelectSuccess(file);
			setIsPdfPicked(true);
		}
	};

	return (
		<div className="w-full file-uploader">
			<label className="text-base font-medium text-gray-900">{name}</label>
			{(isPdfPicked || type === "edit") && (
				<div className="w-full p-2 border border-gray-200 rounded">
					<div className="relative w-8 aspect-square">
						<DocumentIcon className="w-8 h-8 text-brand" />
					</div>
				</div>
			)}
			<input
				id="dropzone-file"
				type="file"
				onChange={handleFileInput}
				className={` w-full text-sm cursor-pointer mt-2 focus:outline-none text-black file:mr-4 file:py-1 file:px-2 file:rounded font-medium file:border-0 file:text-sm file:font-medium file:bg-brand file:text-white hover:file:bg-primary-600`}
			/>
			<button onClick={() => fileInput.current?.click()} />
		</div>
	);
}
