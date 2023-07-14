import React, { useEffect, useState } from "react";
import { Navbar } from "../../../components/Navbar";
import { Layout } from "../../../components/Layout";
import { GetServerSideProps } from "next";
import GetAllRuas from "../../../services/ruas";
import GetAllUnitKerja from "../../../services/unitKerja";
import {
	ArrowDownTrayIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	EyeIcon,
	PencilSquareIcon,
	PlusIcon,
	TrashIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { Button } from "../../../components/Button";
import { showModal } from "../../../components/Modal";
import Link from "next/link";
import Input from "../../../components/Input";
import { Multiselect } from "../../../components/Multiselect";
import { ModalAnimation } from "../../../components/ModalAnimation";
import { ButtonOutline } from "../../../components/ButtonOutline";
import { UploadImage } from "../../../components/UploadImage";
import { notifyError } from "../../../components/Toast";
import { UploadPdf } from "../../../components/UploadPdf";

export const getServerSideProps: GetServerSideProps<{}> = async (ctx: any) => {
	const token = ctx?.req?.cookies.token;
	const result = await GetAllRuas(token, 5, 1);
	const result2 = await GetAllUnitKerja(token);

	return {
		props: {
			dataRuas: result?.data,
			dataUnit: result2?.data,
		},
	};
};

export default function MasterData({ dataRuas, dataUnit }) {
	const [modal, setModal] = useState(false);
	const [action, setAction] = useState("add");
	const [selected, setSelected] = useState([]);
	const [fileImage, setFileImage] = useState();
	const [isImagePicked, setIsImagePicked] = useState(false);
	const [isPdfPicked, setIsPdfPicked] = useState(false);

	// console.log(fileImage);
	// console.log(isImagePicked);

	const [filePdf, setFilePdf] = useState();

	const onChangeUpload = async (e: any) => {
		const file = e.target.files[0];

		// setCandidate({ ...candidate, imageUrl: e.target.files[0] });
		if (file.type !== "image/png") {
			return alert("Format harus PNG");
		}
		if (file.size > 1024000) {
			return alert("Ukuran file tidak boleh lebih dari 1 MB");
		} else {
			console.log("berhasil", file);

			// const data = new FormData();
			// data.append("file", file);
			// try {
			// 	const resp = await axios.post(
			// 		`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
			// 		data
			// 	);
			// 	setImgPreview(resp.data.url);
			// 	setCandidate({
			// 		...candidate,
			// 		imageUrl: resp.data.url,
			// 		imagePublicId: resp.data.public_id,
			// 	});
			// } catch (err) {
			// 	console.log("errr : ", err);
			// }
		}
	};

	const handleAddRuas = async () => {};

	const onClickPage = async (url: string) => {
		try {
			const result = await axios({
				method: "GET",
				url: url,
				headers: {
					Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
				},
			});
			console.log(result);

			// return result;
		} catch (err) {
			return err;
		}
	};
	return (
		<>
			<Navbar />
			<Layout>
				<div className="flex flex-col space-y-10">
					<div className="w-full flex flex-col space-y-2.5">
						<div className="flex flex-row justify-between">
							<h1 className="text-2xl font-bold text-left lg:text-3xl">
								Master Data
							</h1>
							<button
								onClick={() => {
									setModal(true), setAction("add");
								}}
								className="flex items-center px-3 py-2 space-x-2 rounded bg-brand hover:bg-primary-600"
							>
								<PlusIcon className="w-5 h-5 text-white" />
								<span className="text-white">Tambah</span>
							</button>
						</div>
						<div className="flex flex-col space-y-10 lg:space-y-0 lg:space-x-10 lg:flex-row">
							<div className="w-full">
								<div className="overflow-x-auto rounded-xl shadow-card">
									<table className="w-full bg-white border table-auto">
										<thead>
											<tr className="bg-brand">
												<th className="p-4 font-medium text-center text-white">
													No.
												</th>
												<th className="p-4 font-medium text-center text-white">
													Ruas
												</th>
												<th className="p-4 font-medium text-center text-white">
													Lokasi
												</th>
												<th className="p-4 font-medium text-center text-white">
													Foto
												</th>
												<th className="p-4 font-medium text-center text-white">
													Document
												</th>
												<th className="p-4 font-medium text-center text-white">
													Unit Kerja
												</th>
												<th className="p-4 font-medium text-center text-white">
													Status
												</th>
												<th className="p-4 font-medium text-center text-white">
													Aksi
												</th>
											</tr>
										</thead>
										<tbody>
											{dataRuas?.data?.map((data: any, i: number) => (
												<tr key={i}>
													<td className="p-4 text-center">{i + 1}</td>
													<td className="p-4 text-center">{data.ruas_name}</td>
													<td className="p-4 text-center">
														{data.km_awal + " s/d " + data.km_akhir}
													</td>
													<td className="p-4 text-center">
														<div className="flex items-center justify-center">
															{/* Modal Foto */}
															<Button
																onClick={() =>
																	showModal({ src: data.photo_url })
																}
																className="w-16 text-sm"
																type="primary"
																text="Lihat"
															/>
														</div>
													</td>
													<td className="p-4 text-center">
														<div className="flex items-center justify-center">
															<Link
																href={data.doc_url}
																target="_blank"
																className="flex items-center px-3 py-2 space-x-2 border-2 rounded hover:bg-primary-200 w-fit border-brand"
															>
																<span className="text-sm text-brand">
																	Download
																</span>
																<ArrowDownTrayIcon className="w-5 h-5 text-brand" />
															</Link>
														</div>
													</td>
													<td className="p-4 text-center">{data.unit_id}</td>
													<td className="p-4 text-center">
														{data.status === "0" ? "Tidak Aktif" : "Aktif"}
													</td>
													<td className="p-4 text-center">
														<div className="flex items-center justify-center space-x-2.5">
															<button
															// onClick={() => {
															// 	setSelected(data?.unit_id),
															// 		handleUpdateRuas(data, dataUnit);
															// }}
															>
																<PencilSquareIcon className="w-5 h-5 text-orange-500" />
															</button>
															<button>
																<EyeIcon className="w-5 h-5 text-brand" />
															</button>
															<button>
																<TrashIcon className="w-5 h-5 text-danger-500" />
															</button>
														</div>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
								<div className="flex items-center justify-end w-full mt-6 space-x-10 ">
									<select
										value={dataRuas?.per_page}
										className="px-3 py-2 border-2 rounded border-brand focus:outline-none"
									>
										{[5, 10, 20].map((pageSize) => (
											<option key={pageSize} value={pageSize}>
												Show entries {pageSize}
											</option>
										))}
									</select>
									<div className="flex items-center space-x-2.5">
										{dataRuas?.prev_page_url && (
											<button
												onClick={() => onClickPage(dataRuas?.prev_page_url)}
												className={`px-3 py-2 bg-white border-2 rounded border-brand`}
											>
												<ChevronLeftIcon className="w-5 h-5 text-brand" />
											</button>
										)}
										<button
											className={`px-3 py-2 bg-white border-2 rounded border-brand`}
										>
											{dataRuas?.current_page}
										</button>
										{dataRuas?.next_page_url && (
											<button
												onClick={() => onClickPage(dataRuas?.next_page_url)}
												className={`px-3 py-2 bg-white border-2 rounded border-brand`}
											>
												<ChevronRightIcon className="w-5 h-5 text-brand" />
											</button>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Layout>
			<ModalAnimation showModal={modal} title={"Tambah Ruas"}>
				<button onClick={() => setModal(false)}>
					<XMarkIcon className="w-5 h-5 text-gray-900" />
				</button>
				{action === "add" && (
					<div className="flex flex-col items-center justify-center p-4 space-y-5">
						<div className="flex flex-row items-center justify-center w-full space-x-8">
							<div className="flex flex-col w-1/2 space-y-3">
								<Input label={"Ruas"} placeholder={"Masukkan Ruas"} />
								<Multiselect
									name={"Unit"}
									labelFor={"Unit Kerja"}
									selects={dataUnit.data}
									selected={selected}
									setSelected={setSelected}
									max={1}
								></Multiselect>
								<UploadImage
									name="Foto"
									onFileSelectError={(message: any) => notifyError(message)}
									onFileSelectSuccess={(file: any) => setFileImage(file)}
									isImagePicked={isImagePicked}
									setIsImagePicked={setIsImagePicked}
									type={"add"}
									fileImage={fileImage}
								/>
								<UploadPdf
									onFileSelectError={(message: any) => notifyError(message)}
									onFileSelectSuccess={(file: any) => setFilePdf(file)}
									isPdfPicked={isPdfPicked}
									setIsPdfPicked={setIsPdfPicked}
									type="add"
									filePdf={filePdf}
									name="Dokumen"
								/>
							</div>
							<div className="flex flex-col w-1/2 space-y-3">
								<Input label={"Ruas"} placeholder={"Masukkan Ruas"} />
								<Input label={"Ruas"} placeholder={"Masukkan Ruas"} />
								<Input label={"Ruas"} placeholder={"Masukkan Ruas"} />
								<Input label={"Ruas"} placeholder={"Masukkan Ruas"} />
							</div>
						</div>
						<div className="flex justify-end w-full space-x-5">
							<ButtonOutline onClick={() => setModal(false)} text="Kembali" />
							<Button onClick={() => handleAddRuas()} text="Simpan" />
						</div>
					</div>
				)}
			</ModalAnimation>
		</>
	);
}
