import React from "react";

interface Props {
	onChange?: (value: string) => void;
	value?: string;
	ref?: any;
	label: string;
	placeholder: string;
	className?: string;
	type?: string;
}

export default function Input(props: Props) {
	return (
		<div className="flex flex-col items-start w-full max-w-xs space-y-2">
			<label className="text-base font-medium text-gray-900">
				{props.label}
			</label>
			<input
				type={props.type ? props.type : "text"}
				ref={props.ref}
				className={`w-full px-3 py-2 text-gray-900 border border-gray-200 rounded placeholder:text-gray-500 focus:outline-primary-200 ${props.className}`}
				placeholder={props.placeholder}
				onChange={(e) => props.onChange(e.target.value)}
				value={props.value}
			></input>
			{/* <input
			type={props.type ? props.type : "text"}
			className={`bg-zinc-100 py-2 px-3 focus:outline-none ${props.className}`}
			placeholder={props.placeholder}
			onChange={(e) => props.onChange(e.target.value)}
			value={props.value}
		/> */}
		</div>
	);
}
