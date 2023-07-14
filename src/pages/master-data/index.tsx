import React, { useEffect, useRef, useState } from "react";
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

export const getServerSideProps: GetServerSideProps<{}> = async (ctx: any) => {
	const token = ctx?.req?.cookies.token;
	const result = await GetAllRuas(token, 5, 1);
	const result2 = await GetAllUnitKerja(token);

	return {
		props: {
			dataRuas: result?.data,
			dataUnit: result2?.data,
			token: token,
		},
	};
};

export default function MasterData({ dataRuas, dataUnit, token }) {
	const [modal, setModal] = useState(false);
	const [action, setAction] = useState("add");
	const [isImagePicked, setIsImagePicked] = useState(false);
	const [isPdfPicked, setIsPdfPicked] = useState(false);

	// console.log(fileImage);
	// console.log(isImagePicked);
	const [filePdf, setFilePdf] = useState(null);
	const [selected, setSelected] = useState([]);
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

	const [fileImage, setFileImage] = useState(null);
	const [ruasForm, setRuasForm] = useState<Ruas>({
		ruasName: "",
		longMiles: "",
		initMiles: "",
		lastMiles: "",
	});

	const handleAddRuas = async () => {
		const unitIds = selected.map((unit) => unit.id); // Membuat array unitId
		var formdata = new FormData();
		formdata.append("unit_id", unitIds.join(","));
		formdata.append("ruas_name", ruasForm.ruasName);
		formdata.append("long", ruasForm.longMiles);
		formdata.append("km_awal", ruasForm.initMiles);
		formdata.append("km_akhir", ruasForm.lastMiles);
		formdata.append("status", "0");
		formdata.append("file", filePdf);
		formdata.append("photo", fileImage);
		if (
			unitIds.length == 0 ||
			ruasForm.ruasName.length == 0 ||
			ruasForm.longMiles.length == 0 ||
			ruasForm.initMiles.length == 0 ||
			ruasForm.lastMiles.length == 0 ||
			filePdf.length == 0 ||
			fileImage.length == 0
		) {
			notifyError("Pastikan semuanya sudah terisi!");
		} else {
			console.log(formdata);
			const result = await CreateRuas(token, formdata);
			if (result.status) {
				notifySuccess("Berhasil disimpan");
			} else {
				notifyError("Pastikan semuanya sudah terisi!");
			}
		}
	};

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
								<select className="px-3 py-2 border-2 rounded border-brand focus:outline-none">
									{status.map((status, i: number) => (
										<option key={i} value={status.id}>
											{status.name}
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
				)}
			</ModalAnimation>
		</>
	);
}
