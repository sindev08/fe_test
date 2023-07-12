import { useState } from "react";
import { Button } from "./Button";
import { createRoot } from "react-dom/client";

interface Props {
	isOpen?: boolean;
	title?: string;
	message?: string;
	positiveBtnText?: string;
	negativeBtnText?: string;
	onPositiveClick?: () => void;
	onNegativeClick?: () => void;
}

function Alert(props: Props) {
	const [isOpen, setIsOpen] = useState(props.isOpen);
	return (
		<div
			className={`relative z-10 ${!isOpen && "hidden"}`}
			role="dialog"
			arial-modal="true"
		>
			<div className="fixed inset-0 transition-opacity bg-zinc-900 bg-opacity-40"></div>
			<div className="fixed inset-0 z-10 overflow-y-auto">
				<div className="flex items-center justify-center min-h-full text-center">
					<div className="relative p-4 overflow-hidden text-left transition-all transform bg-white rounded-md shadow-xl">
						{/* Content */}
						<div className="w-full p-5 text-center">
							<p className="text-2xl font-bold">{props.title || "Title"}</p>
							<p className="text-lg"> {props.message || "Message Here"}</p>
						</div>
						{/* Content */}
						<div className="flex justify-center mt-5 space-x-5">
							<button
								className="px-2 py-1 text-sm bg-zinc hover:bg-zinc-200 bg-zinc-100"
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

export function showAlert(props: Props) {
	const alert = document.createElement("div");
	alert.id = "alert";
	document.body.appendChild(alert);
	const root = createRoot(alert);
	root.render(
		<Alert
			isOpen={true}
			title={props.title}
			message={props.message}
			positiveBtnText={props.positiveBtnText}
			negativeBtnText={props.negativeBtnText}
			onPositiveClick={props.onPositiveClick}
			onNegativeClick={props.onNegativeClick}
		/>
	);
}
