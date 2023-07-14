import Image from "next/image";
import { useRef } from "react";

interface UploadImageProps {
	onFileSelectError: any;
	onFileSelectSuccess: any;
	isImagePicked: any;
	setIsImagePicked: any;
	type: string;
	fileImage: any;
	name: string;
}

export function UploadImage({
	onFileSelectError,
	onFileSelectSuccess,
	isImagePicked,
	setIsImagePicked,
	type,
	name,
	fileImage,
}: UploadImageProps) {
	const fileInput = useRef(null);

	const handleFileInput = (e) => {
		const file = e.target.files[0];
		if (file.type !== "image/png") {
			return onFileSelectError("Format file harus PNG");
		} else if (file.size > 1024000) {
			return onFileSelectError("Ukuran File Tidak boleh lebih dari 1 MB");
		} else {
			onFileSelectSuccess(file);
			setIsImagePicked(true);
		}
	};

	return (
		<div className="w-full space-y-2 file-uploader">
			<label className="text-base font-medium text-gray-900">{name}</label>
			{isImagePicked && (
				<div className="relative w-8 aspect-square">
					<Image
						fill
						src={URL.createObjectURL(fileImage)}
						className="object-cover "
						alt=""
					/>
				</div>
			)}
			{/* {isImagePicked && type == "add" && "file telah diupload"}
				{!isImagePicked && type == "update" && "file untuk update"}
				{isImagePicked && type == "update" && "file telah diganti"}
				{isImagePicked && type == "add" && "file masih kosong"} */}
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
