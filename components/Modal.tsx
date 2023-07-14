import { useState } from "react";
import { Button } from "./Button";
import { createRoot } from "react-dom/client";
import Image from "next/image";
import Input from "./Input";
import { Multiselect } from "./Multiselect";
import { GetServerSideProps } from "next";
import GetAllUnitKerja from "../services/unitKerja";

interface Props {
	isOpen?: boolean;
	src?: string;
	// message?: string;
	content?: any;
	positiveBtnText?: string;
	negativeBtnText?: string;
	onPositiveClick?: () => void;
	onNegativeClick?: () => void;
}

export const getServerSideProps: GetServerSideProps<{}> = async (ctx: any) => {
	// console.log(ctx?.req?.cookies.token);
	const token = ctx?.req?.cookies.token;
	const result = await GetAllUnitKerja(token);

	return {
		props: {
			dataUnit: result?.data,
		},
	};
};

function Modal(props: Props) {
	const [isOpen, setIsOpen] = useState(props.isOpen);
	const [selected, setSelected] = useState([]);

	return (
		<div
			className={`relative z-10 ${!isOpen && "hidden"}`}
			role="dialog"
			arial-modal="true"
		>
			<div className="fixed inset-0 transition-opacity bg-zinc-900 bg-opacity-40"></div>
			<div className="fixed inset-0 z-10 overflow-y-auto">
				<div className="flex items-center justify-center min-h-full text-center">
					<div className="relative p-4 overflow-hidden transition-all transform bg-white rounded-md shadow-xl">
						{/* Content */}
						{props.src && (
							<div className="relative">
								<Image src={props.src} width={400} height={400} alt="image" />
							</div>
						)}
						{props.content}
						{/* Button */}
						<div className="flex justify-end mt-5">
							<button
								className="px-3 py-2 text-sm text-white rounded bg-brand hover:bg-primary-600"
								onClick={() => {
									props.onNegativeClick;
									setIsOpen(false);
								}}
							>
								{props.negativeBtnText || "Kembali"}
							</button>
							<Button
								text={props.positiveBtnText || "Iya"}
								className={`${
									!props.onPositiveClick && "hidden"
								} min-w-[120px]`}
								onClick={() => {
									props.onPositiveClick && props.onPositiveClick();
									setIsOpen(false);
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export function showModal(props: Props) {
	const modal = document.createElement("div");
	modal.id = "modal";
	document.body.appendChild(modal);
	const root = createRoot(modal);
	root.render(
		<Modal
			isOpen={true}
			src={props.src}
			// message={props.message}
			content={props.content}
			positiveBtnText={props.positiveBtnText}
			negativeBtnText={props.negativeBtnText}
			onPositiveClick={props.onPositiveClick}
			onNegativeClick={props.onNegativeClick}
		/>
	);
}
