import React from "react";

interface Props {
	text: string;
	type?: "primary" | "danger";
	className?: string;
	onClick?: () => void;
	isLoading?: boolean;

	// url?: string | any;
}

export const ButtonOutline = (props: Props) => {
	return (
		<button
			className={`${
				props.type === "danger"
					? "border-danger-500 border-2 hover:bg-danger-600 text-danger-500"
					: "border-brand border-2 hover:bg-primary-100 text-brand"
			}  px-3 py-2 rounded ${props.className}`}
			onClick={props.onClick}
			disabled={props.isLoading}
		>
			{props.isLoading ? "Loading..." : props.text}
		</button>
	);
};
