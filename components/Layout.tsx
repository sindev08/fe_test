import React from "react";

interface Props {
	children: string | JSX.Element | JSX.Element[];
}

export const Layout = (props: Props) => {
	return (
		<div className="w-full min-h-screen pt-16 pb-8 bg-main">
			<div className="px-4 mx-auto mt-12 max-w-7xl xl:px-0">
				{props.children}
			</div>
		</div>
	);
};
