import React, { useEffect, useState } from "react";
import { CheckCircleIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

interface MultiselectProps {
	name: string;
	children?: JSX.Element | JSX.Element[];
	labelFor: string;
	selects: any;
	selected: any;
	setSelected: any;
	max: number;
	type?: string;
}

export const Multiselect = ({
	name,
	children,
	labelFor,
	selects,
	selected,
	setSelected,
	max,
	type,
}: MultiselectProps) => {
	const [showDropdown, setShowDropdown] = useState(false);
	const [selectsTemp, setSelectTemp] = useState(null);
	useEffect(() => {
		if (type === "edit") {
			selects.map((selectName: any, i: number) =>
				selected.find(
					(select: any) =>
						select.id == selectName.id && setSelectTemp(selectName)
				)
			);
		}
	}, [setSelectTemp, selectsTemp]);

	const handleClickSelect = (value: any) => {
		if (selected.find((select: any) => select.id == value.id)) {
			setSelected(selected.filter((select: any) => select.id != value.id));
			setSelectTemp(null);
			console.log();
		} else {
			if (selected.length < max) {
				setSelected([...selected, value]);
				setSelectTemp(null);
			} else {
				setSelected([value]);
				setSelectTemp(null);
			}
		}
	};

	return (
		<div className="flex flex-col space-y-1">
			<label
				htmlFor={labelFor}
				className="flex items-center text-sm font-semibold text-gray-900 capitalize"
			>
				{name} {children} :
			</label>
			<div
				className={`flex flex-col items-center overflow-hidden rounded border border-gray-200`}
			>
				<button
					onClick={() => setShowDropdown((prev) => !prev)}
					className="flex items-center justify-between w-full p-2 "
				>
					<span className="text-sm text-gray-900 capitalize">
						{type == "edit" && selectsTemp
							? selectsTemp?.unit
							: selected?.length > 0
							? selected[0].unit
							: "Pilih"}
						{/* {selected?.length > 0 ? selected[0].unit : "Pilih"} */}
					</span>
					{selected?.length > 0 ? (
						<CheckCircleIcon className="w-6 h-6 text-brand" />
					) : (
						<ChevronDownIcon className="w-4 h-6 text-brand" />
					)}
				</button>
				<div
					className={`${
						showDropdown ? "max-h-[200px] overflow-y-auto" : "max-h-0"
					} w-full duration-300 ease-in-out`}
				>
					{selects.map((selectName: any, i: number) => (
						<button
							onClick={() => {
								handleClickSelect(selectName);
								setShowDropdown((prev) => !prev);
							}}
							key={i}
							className="flex items-center justify-between w-full px-4 py-2 bg-white hover:bg-primary-50"
						>
							<span className="text-sm text-left text-gray-900 capitalize">
								{selectName.unit}
							</span>
							{selected.find((select: any) => select.id == selectName.id) && (
								<CheckCircleIcon className="w-6 h-6 text-brand" />
							)}
						</button>
					))}
				</div>
			</div>
		</div>
	);
};
