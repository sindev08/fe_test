import React from "react";
import usePortal from "react-useportal";
import { useTransition, animated } from "@react-spring/web";

interface ModalProps {
	showModal: boolean;
	title: string;
	children?: JSX.Element | JSX.Element[];
}

export const ModalAnimation = ({ showModal, title, children }: ModalProps) => {
	const { Portal } = usePortal();
	const fadeTransition = useTransition(showModal, {
		from: { opacity: 0, transform: "translateY(100px)" },
		enter: { opacity: 1, transform: "translateY(0px)" },
		leave: { opacity: 0, transform: "translateY(100px)" },
	});

	return (
		<>
			{fadeTransition(
				(style, showModal) =>
					showModal && (
						<Portal>
							<div className="fixed inset-0 z-[99] !m-0 h-screen bg-black/10 backdrop-blur duration-75">
								<animated.div
									style={style}
									className="flex flex-col items-center justify-end w-full h-full space-y-8 md:justify-center"
								>
									<div className="relative flex flex-col w-full max-w-xl bg-white rounded-t-xl md:rounded-xl">
										<div className="flex flex-row justify-between px-6 py-5 border-b border-gray-100">
											<span className="text-2xl font-semibold text-gray-900 capitalize">
												{title}
											</span>
											{children[0]}
										</div>
										{children[1]}
									</div>
								</animated.div>
							</div>
						</Portal>
					)
			)}
		</>
	);
};
