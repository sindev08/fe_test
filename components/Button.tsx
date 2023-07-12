import React from "react";

interface Props {
	text: string;
	type?: "primary" | "danger";
	className?: string;
	onClick?: () => void;
	isLoading?: boolean;

	// url?: string | any;
}

export const Button = (props: Props) => {
	return (
		<button
			className={`${
				props.type === "danger"
					? "bg-danger-500 focus:bg-danger-700 hover:bg-danger-600 text-white"
					: "bg-brand focus:bg-primary-700 hover:bg-primary-600 text-white"
			}  px-3 py-2 rounded font-medium ${props.className}`}
			onClick={props.onClick}
			disabled={props.isLoading}
		>
			{props.isLoading ? "Loading..." : props.text}
		</button>
	);
};
