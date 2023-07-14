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
}

export function UploadPdf({
	onFileSelectError,
	onFileSelectSuccess,
	isPdfPicked,
	setIsPdfPicked,
	type,
	name,
	filePdf,
}: UploadPdfProps) {
	const fileInput = useRef(null);

	const handleFileInput = (e) => {
		const file = e.target.files[0];
		console.log(file.type);

		// if (file.type !== "image/png") {
		// 	return onFileSelectError("Format file harus PNG");
		// } else if (file.size > 1024000) {
		// 	return onFileSelectError("Ukuran File Tidak boleh lebih dari 1 MB");
		// } else {
		// 	onFileSelectSuccess(file);
		// 	setIsImagePicked(true);
		// }
	};

	return (
		<div className="w-full space-y-2 file-uploader">
			<label className="text-base font-medium text-gray-900">{name}</label>
			{isPdfPicked && (
				<div className="relative w-8 aspect-square">
					<DocumentIcon className="w-8 h-8 text-brand" />
				</div>
			)}
			<input
				id="dropzone-file"
				type="file"
				onChange={handleFileInput}
				className={`w-full text-sm cursor-pointer focus:outline-none text-black file:mr-4 file:py-2 file:px-3 file:rounded font-medium file:border-0 file:text-sm file:font-medium file:bg-brand file:text-white hover:file:bg-primary-600`}
			/>
			<button onClick={() => fileInput.current?.click()} />
		</div>
	);
}
