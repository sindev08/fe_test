import { Bar, Pie } from "react-chartjs-2";
import { Button } from "../../components/Button";
import { Layout } from "../../components/Layout";
import { Navbar } from "../../components/Navbar";
import {
	ArcElement,
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	Title,
	Tooltip,
} from "chart.js";
import { GetServerSideProps } from "next";
import GetAllUnitKerja from "../../services/unitKerja";
import GetAllRuas from "../../services/ruas";
import Link from "next/link";
import {
	ArrowDownTrayIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { showModal } from "../../components/Modal";
import axios from "axios";
import { useState } from "react";
import { notifyError } from "../../components/Toast";

export const getServerSideProps: GetServerSideProps<{}> = async (ctx: any) => {
	const token = ctx?.req?.cookies.token;
	const result = await GetAllRuas(token, 5, 1);
	const result2 = await GetAllUnitKerja(token);

	return {
		props: {
			datas: result?.data,
			datasUnitKerja: result2?.data,
			token: token,
		},
	};
};

export default function Home({ datas, datasUnitKerja, token }) {
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
	const data = {
		labels: datasUnitKerja.data.map((data: any) => data.unit),
		datasets: [
			{
				label: "Data Unit",
				data: datasUnitKerja.data.map((data: any) => data.status),
				backgroundColor: "rgba(25, 118, 210, 1)",
			},
		],
	};
	const dataPie = {
		labels: datasUnitKerja.data.map((data: any) => data.unit),
		datasets: [
			{
				label: "# of Votes",
				data: datasUnitKerja.data.map((data: any) => data.status),
				backgroundColor: [
					"rgba(255, 99, 132, 0.6)",
					"rgba(54, 162, 235, 0.6)",
					"rgba(255, 206, 86, 0.6)",
					"rgba(75, 192, 192, 0.6)",
					"rgba(153, 102, 255, 0.6)",
					"rgba(255, 159, 64, 0.6)",
				],
				borderColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(75, 192, 192, 1)",
					"rgba(153, 102, 255, 1)",
					"rgba(255, 159, 64, 1)",
				],
				borderWidth: 1,
			},
		],
	};
	return (
		<>
			<Navbar />
			<Layout>
				<div className="flex flex-col space-y-10">
					<div className="w-full flex flex-col space-y-2.5">
						<h1 className="text-2xl font-bold text-left lg:text-3xl">
							Dashboard
						</h1>
						<div className="flex flex-col space-y-10 lg:space-y-0 lg:space-x-10 lg:flex-row">
							<div className="hidden w-full p-4 bg-white sm:block lg:w-2/3 h-96 shadow-card rounded-xl">
								<Bar options={options} data={data} />
							</div>
							<div className="w-full p-4 bg-white lg:w-1/3 h-96 shadow-card rounded-xl">
								<Pie data={dataPie} />
							</div>
						</div>
					</div>
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
														onClick={() => showModal({ src: data.photo_url })}
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
														<span className="text-sm text-brand">Download</span>
														<ArrowDownTrayIcon className="w-5 h-5 text-brand" />
													</Link>
												</div>
											</td>
											<td className="p-4 text-center">{data.unit_id}</td>
											<td className="p-4 text-center">
												{data.status === "0" ? "Tidak Aktif" : "Aktif"}
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
			</Layout>
		</>
	);
}

ChartJS.register(
	ArcElement,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

export const options = {
	responsive: true,
	plugins: {
		legend: {
			position: "top" as const,
		},
		title: {
			display: true,
			text: "Chart.js Bar Chart",
		},
	},
};
