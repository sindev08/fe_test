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
	editFile?: string;
}

export function UploadImage({
	onFileSelectError,
	onFileSelectSuccess,
	isImagePicked,
	setIsImagePicked,
	type,
	name,
	editFile,
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
				<div className="w-full p-2 border border-gray-200 rounded">
					<div className="relative w-8 aspect-square">
						<Image
							fill
							src={URL.createObjectURL(fileImage)}
							className="object-cover "
							alt=""
						/>
					</div>
				</div>
			)}
			{!isImagePicked && type == "edit" && editFile.length > 0 && (
				<div className="w-full p-2 border border-gray-200 rounded">
					<div className="relative w-8 aspect-square">
						<Image fill src={editFile} className="object-cover " alt="" />
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
