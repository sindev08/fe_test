import React from "react";
import { Navbar } from "../../../components/Navbar";
import { Layout } from "../../../components/Layout";
import { GetServerSideProps } from "next";
import GetAllRuas from "../../../services/ruas";
import {
	ArrowDownTrayIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	EyeIcon,
	PencilSquareIcon,
	PlusIcon,
	TrashIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { Button } from "../../../components/Button";
import { showModal } from "../../../components/Modal";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps<{}> = async (ctx: any) => {
	// console.log(ctx?.req?.cookies.token);
	const token = ctx?.req?.cookies.token;
	const result = await GetAllRuas(token, 5, 1);

	return {
		props: {
			dataRuas: result?.data,
		},
	};
};

export default function MasterData({ dataRuas }) {
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
							<button className="flex items-center px-3 py-2 space-x-2 rounded bg-brand hover:bg-primary-600">
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
																onClick={() =>
																	showModal({
																		positiveBtnText: "Test",
																		onPositiveClick: () => console.log("test"),
																	})
																}
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
		</>
	);
}
