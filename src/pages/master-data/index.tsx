import React, { useState } from "react";
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
import { notifySuccess } from "../../../components/Toast";
import CreateRuas from "../../../services/ruas/CreateRuas";
import DeleteRuas from "../../../services/ruas/DeleteRuas";
import { useRouter } from "next/router";
import UpdateRuas from "../../../services/ruas/UpdateRuas";

export const getServerSideProps: GetServerSideProps<{}> = async (ctx: any) => {
	const token = ctx?.req?.cookies.token;
	const result = await GetAllRuas(token, 5, 1);
	const result2 = await GetAllUnitKerja(token);

	return {
		props: {
			datas: result?.data,
			dataUnit: result2?.data,
			token: token,
		},
	};
};

export default function MasterData({ datas, dataUnit, token }) {
	const [dataRuas, setDataRuas] = useState(datas);
	const requestOptions = {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const nextOrPrevPage = async (url: string) => {
		try {
			const response = await axios.get(url, requestOptions);
			setDataRuas(response?.data);
		} catch (error) {
			notifyError("Gagal Request");
		}
	};
	const selectPerPage = async (per_page: any) => {
		try {
			const response = await GetAllRuas(token, per_page, 1);
			setDataRuas(response?.data);
		} catch (error) {
			notifyError("Gagal Request");
		}
	};

	const [modal, setModal] = useState(false); // state ini digunakan untuk menampilkan/menutup popup modal
	const [action, setAction] = useState(""); // state ini digunakan untuk mengganti tipe aksi seperti tambah, update dan hapus data
	const [isImagePicked, setIsImagePicked] = useState(false); // state ini digunakan untuk menampung file image
	const [isPdfPicked, setIsPdfPicked] = useState(false); // state ini digunakan untuk menampung file pdf/dokument
	const [filePdf, setFilePdf] = useState("");
	const router = useRouter();
	const status = [
		{
			id: 1,
			name: "aktif",
		},
		{
			id: 0,
			name: "tidak aktif",
		},
	];

	const [fileImage, setFileImage] = useState("");
	const [editFile, setEditFile] = useState<EditFile>({
		pdf: "",
		image: "",
	});
	const [ruasForm, setRuasForm] = useState<Ruas>({
		ruasName: "",
		longMiles: "",
		initMiles: "",
		lastMiles: "",
		unit: [],
		id: "",
		status: "",
	});

	const handleAddRuas = async () => {
		const unitIds = ruasForm.unit.map((units: any) => units.id); // Membuat array unitId
		var formdata = new FormData();
		formdata.append("unit_id", unitIds.join(","));
		formdata.append("ruas_name", ruasForm.ruasName);
		formdata.append("long", ruasForm.longMiles);
		formdata.append("km_awal", ruasForm.initMiles);
		formdata.append("km_akhir", ruasForm.lastMiles);
		formdata.append("status", ruasForm.status);
		formdata.append("file", filePdf);
		formdata.append("photo", fileImage);
		if (
			unitIds.length == 0 ||
			ruasForm.ruasName.length == 0 ||
			ruasForm.longMiles.length == 0 ||
			ruasForm.initMiles.length == 0 ||
			ruasForm.lastMiles.length == 0 ||
			filePdf.length == 0 ||
			fileImage.length == 0 ||
			status.length === 0
		) {
			notifyError("Pastikan semuanya sudah terisi!");
		} else {
			console.log(formdata);
			const result = await CreateRuas(token, formdata);
			if (result.status) {
				notifySuccess(result.data.message);
				setTimeout(() => {
					router.reload();
				}, 3000);
			} else {
				notifyError("Gagal disimpan!");
				console.log(result);
			}
		}
	};

	const handleUpdateRuas = async () => {
		const unitIds = ruasForm.unit.map((units: any) => units.id); // Membuat array unitId
		if (
			unitIds.length == 0 ||
			ruasForm.ruasName.length == 0 ||
			ruasForm.longMiles.length == 0 ||
			ruasForm.initMiles.length == 0 ||
			ruasForm.lastMiles.length == 0 ||
			status.length === 0
		) {
			notifyError("Pastikan semuanya sudah terisi!");
		} else {
			var formDataUpdate = new FormData();
			formDataUpdate.append("_method", "PUT");
			formDataUpdate.append("unit_id", unitIds.join(","));
			formDataUpdate.append("ruas_name", ruasForm.ruasName);
			formDataUpdate.append("long", ruasForm.longMiles);
			formDataUpdate.append("km_awal", ruasForm.initMiles);
			formDataUpdate.append("km_akhir", ruasForm.lastMiles);
			formDataUpdate.append("status", ruasForm.status);
			if (fileImage) {
				formDataUpdate.append("photo", fileImage);
			} else {
				formDataUpdate.append("photo", "");
			}
			if (filePdf) {
				formDataUpdate.append("file", filePdf);
			} else {
				formDataUpdate.append("file", "");
			}
			const result = await UpdateRuas(token, formDataUpdate, ruasForm.id);
			if (result.status) {
				notifySuccess(result.data.message);
				setTimeout(() => {
					router.reload();
				}, 3000);
			} else {
				notifyError("Gagal Update data!");
			}
		}
	};

	const handleDelete = async (id: number) => {
		const result = await DeleteRuas(token, id);
		if (result.status) {
			notifySuccess(result.data.message);
			console.log(result);
			setTimeout(() => {
				router.reload();
			}, 3000);
		} else {
			notifyError(result.data.message);
			console.log(result);
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
									setRuasForm({
										...ruasForm,
										id: "",
										ruasName: "",
										status: "",
										longMiles: "",
										initMiles: "",
										lastMiles: "",
										unit: [],
									}),
										setFileImage(null);
									setFilePdf(null);
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
												{dataRuas && (
													<th className="p-4 font-medium text-center text-white">
														Aksi
													</th>
												)}
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
																onClick={(e) => {
																	setRuasForm({
																		...ruasForm,
																		id: data.id,
																		ruasName: data.ruas_name,
																		status: data.status,
																		longMiles: data.long,
																		initMiles: data.km_awal,
																		lastMiles: data.km_akhir,
																		unit: [{ id: data.unit_id, unit: "" }],
																	}),
																		setEditFile({
																			...editFile,
																			pdf: data.doc_url,
																			image: data.photo_url,
																		});
																	setAction("edit"), setModal(true);
																}}
															>
																<PencilSquareIcon className="w-5 h-5 text-orange-500" />
															</button>
															<button
																onClick={(e) => {
																	setRuasForm({
																		...ruasForm,
																		id: data.id,
																		ruasName: data.ruas_name,
																		status: data.status,
																		longMiles: data.long,
																		initMiles: data.km_awal,
																		lastMiles: data.km_akhir,
																		unit: [{ id: data.unit_id, unit: "" }],
																	}),
																		setEditFile({
																			...editFile,
																			pdf: data.doc_url,
																			image: data.photo_url,
																		});
																	setAction("edit"), setModal(true);
																}}
															>
																<EyeIcon className="w-5 h-5 text-brand" />
															</button>
															<button
																onClick={(e) => {
																	setRuasForm({
																		...ruasForm,
																		id: data.id,
																		ruasName: data.ruas_name,
																	}),
																		setAction("delete"),
																		setModal(true);
																}}
															>
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
										defaultValue={dataRuas?.per_page}
										className="px-3 py-2 border-2 rounded border-brand focus:outline-none"
										onChange={(e) => selectPerPage(e.target.value)}
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
												onClick={() => nextOrPrevPage(dataRuas?.prev_page_url)}
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
												onClick={() => nextOrPrevPage(dataRuas?.next_page_url)}
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
			<ModalAnimation
				showModal={modal}
				title={`${action === "add" ? "Tambah Ruas" : ""} ${
					action === "delete" ? "Hapus Ruas" : ""
				} ${action === "edit" ? "Edit Ruas" : ""}`}
			>
				{action == "edit" ? (
					<button
						onClick={() => {
							setModal(false), setFilePdf(null), setFileImage(null);
						}}
					>
						<XMarkIcon className="w-5 h-5 text-gray-900" />
					</button>
				) : (
					<button
						onClick={() => {
							setModal(false);
						}}
					>
						<XMarkIcon className="w-5 h-5 text-gray-900" />
					</button>
				)}
				{action === "add" ? (
					<div className="flex flex-col h-[80vh] overflow-y-auto sm:h-full items-center justify-center p-4 space-y-5">
						<div className="flex flex-col items-center justify-center w-full space-y-3 sm:space-y-0 sm:space-x-8 sm:flex-row">
							<div className="flex flex-col w-full space-y-3 sm:w-1/2">
								<Input
									onChange={(e) => setRuasForm({ ...ruasForm, ruasName: e })}
									label={"Ruas"}
									placeholder={"Masukkan Ruas"}
								/>
								<Multiselect
									name={"Unit"}
									labelFor={"Unit Kerja"}
									selects={dataUnit.data}
									selected={ruasForm.unit}
									setSelected={(e: number) =>
										setRuasForm({ ...ruasForm, unit: e })
									}
									max={1}
								></Multiselect>
								<UploadImage
									name="Foto"
									onFileSelectError={(message: any) => notifyError(message)}
									onFileSelectSuccess={(file: any) => setFileImage(file)}
									isImagePicked={isImagePicked}
									setIsImagePicked={setIsImagePicked}
									type="add"
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
							<div className="flex flex-col w-full space-y-3 sm:w-1/2">
								<Input
									onChange={(e) => setRuasForm({ ...ruasForm, longMiles: e })}
									label={"Panjang (km)*"}
									placeholder={"Masukkan Panjang (km)"}
								/>
								<Input
									label={"Km Awal*"}
									placeholder={"Masukkan Km Awal"}
									onChange={(e) => setRuasForm({ ...ruasForm, initMiles: e })}
								/>
								<Input
									label={"Km Akhir*"}
									placeholder={"Masukkan Km Akhir"}
									onChange={(e) => setRuasForm({ ...ruasForm, lastMiles: e })}
								/>
								<select
									defaultValue={ruasForm.status}
									onChange={(e) =>
										setRuasForm({ ...ruasForm, status: e.target.value })
									}
									className="px-3 py-2 border-2 rounded border-brand focus:outline-none"
								>
									{status.map((dataStatus, i: number) => (
										<option value={dataStatus.id} key={i}>
											{dataStatus.name}
										</option>
									))}
								</select>
							</div>
						</div>
						<div className="flex justify-end w-full space-x-5">
							<ButtonOutline onClick={() => setModal(false)} text="Kembali" />
							<Button onClick={() => handleAddRuas()} text="Simpan" />
						</div>
					</div>
				) : action === "edit" ? (
					<div className="flex flex-col h-[80vh] overflow-y-auto sm:h-full items-center justify-center p-4 space-y-5">
						<div className="flex flex-col items-center justify-center w-full space-y-3 sm:space-y-0 sm:space-x-8 sm:flex-row">
							<div className="flex flex-col w-full space-y-3 sm:w-1/2">
								<Input
									value={ruasForm.ruasName}
									onChange={(e) => setRuasForm({ ...ruasForm, ruasName: e })}
									label={"Ruas"}
									placeholder={"Masukkan Ruas"}
								/>
								<Multiselect
									type="edit"
									name={"Unit"}
									labelFor={"Unit Kerja"}
									selects={dataUnit.data}
									selected={ruasForm.unit}
									setSelected={(e: number) =>
										setRuasForm({ ...ruasForm, unit: e })
									}
									max={1}
								></Multiselect>
								<UploadImage
									editFile={editFile.image}
									name="Foto"
									onFileSelectError={(message: any) => notifyError(message)}
									onFileSelectSuccess={(file: any) => setFileImage(file)}
									isImagePicked={isImagePicked}
									setIsImagePicked={setIsImagePicked}
									type={"edit"}
									fileImage={fileImage}
								/>
								<UploadPdf
									editFile={editFile.pdf}
									onFileSelectError={(message: any) => notifyError(message)}
									onFileSelectSuccess={(file: any) => setFilePdf(file)}
									isPdfPicked={isPdfPicked}
									setIsPdfPicked={setIsPdfPicked}
									type="edit"
									filePdf={filePdf}
									name="Dokumen"
								/>
							</div>
							<div className="flex flex-col w-full space-y-3 sm:w-1/2">
								<Input
									value={ruasForm.longMiles}
									onChange={(e) => setRuasForm({ ...ruasForm, longMiles: e })}
									label={"Panjang (km)*"}
									placeholder={"Masukkan Panjang (km)"}
								/>
								<Input
									value={ruasForm.initMiles}
									label={"Km Awal*"}
									placeholder={"Masukkan Km Awal"}
									onChange={(e) => setRuasForm({ ...ruasForm, initMiles: e })}
								/>
								<Input
									value={ruasForm.lastMiles}
									label={"Km Akhir*"}
									placeholder={"Masukkan Km Akhir"}
									onChange={(e) => setRuasForm({ ...ruasForm, lastMiles: e })}
								/>
								<select
									defaultValue={ruasForm.status}
									onChange={(e) =>
										setRuasForm({ ...ruasForm, status: e.target.value })
									}
									className="px-3 py-2 border-2 rounded border-brand focus:outline-none"
								>
									{status.map((dataStatus, i: number) => (
										<option value={dataStatus.id} key={i}>
											{dataStatus.name}
										</option>
									))}
								</select>
							</div>
						</div>
						<div className="flex justify-end w-full space-x-5">
							<ButtonOutline onClick={() => setModal(false)} text="Kembali" />
							<Button onClick={() => handleUpdateRuas()} text="Simpan" />
						</div>
					</div>
				) : action === "delete" ? (
					<div className="flex flex-col h-[80vh] overflow-y-auto sm:h-full items-center justify-center p-4 space-y-5">
						<div className="flex flex-col items-center justify-center py-8 space-y-8">
							<TrashIcon className="w-16 h-16 text-danger-500" />
							<p className="max-w-[18rem] text-xl leading-10 font-medium text-center">
								Apakah Anda yakin ingin menghapus data{" "}
								<span className="px-2 py-1 font-bold text-black rounded-sm bg-primary-100">
									{ruasForm.ruasName}
								</span>
								?
							</p>
						</div>
						<div className="flex justify-end w-full space-x-5">
							<ButtonOutline onClick={() => setModal(false)} text="Kembali" />
							<Button
								type="danger"
								onClick={() => handleDelete(ruasForm.id)}
								text="Hapus"
							/>
						</div>
					</div>
				) : null}
			</ModalAnimation>
		</>
	);
}
