import { useCallback, useState } from "react";
import { usePopper } from "react-popper";

interface PopoverProps {
	show?: any;
	children?: JSX.Element | JSX.Element[];
}

export const Dropdown = (props: PopoverProps) => {
	const [referenceElement, setReferenceElement] = useState(null);
	const [popperElement, setPopperElement] = useState(null);
	const [arrowElement, setArrowElement] = useState(null);
	const { styles, update, attributes } = usePopper(
		referenceElement,
		popperElement,
		{
			placement: "bottom",
			modifiers: [{ name: "arrow", options: { element: arrowElement } }],
		}
	);
	const [show, setShow] = useState(false);
	const open = useCallback(() => setShow(true), [setShow]);
	const close = useCallback(() => setShow(false), [setShow]);

	return (
		<div onMouseEnter={open} onMouseLeave={close}>
			<div className="cursor-pointer" ref={setReferenceElement}>
				{props.children[0]}
			</div>
			<div
				className={`${
					show ? "visible opacity-100" : "invisible opacity-0"
				} transition-visibility bg-white shadow-card text-gray-900 rounded-lg z-[999]`}
				// show={props.show}
				ref={setPopperElement}
				style={styles.popper}
				{...attributes.popper}
			>
				{props.children[1]}
				<div
					className={`arrow-${
						attributes.popper?.["data-popper-placement"] ?? ""
					} w-2 h-2 z-[998] before:absolute before:w-2 before:h-2 before:z-[997] before:content-[''] before:rotate-45 before:bg-white`}
					ref={setArrowElement}
					style={styles.arrow}
					{...attributes.arrow}
				/>
			</div>
		</div>
	);
};
