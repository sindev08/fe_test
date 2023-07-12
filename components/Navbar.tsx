import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
	ArrowLeftOnRectangleIcon,
	Cog6ToothIcon,
	UserCircleIcon,
} from "@heroicons/react/24/solid";
import { Dropdown } from "./Dropdown";
import { deleteCookie } from "cookies-next";

export const Navbar = () => {
	const { pathname } = useRouter();
	const Menu = [
		{
			name: "dashboard",
			link: "/",
		},
		{
			name: "master data",
			link: "/master-data",
		},
	];

	const { replace } = useRouter();

	const Logout = () => {
		deleteCookie("token");
		replace("/");
	};

	return (
		<nav className="fixed top-0 z-10 w-full bg-white shadow-card ">
			<div className="flex flex-row justify-between w-full px-4 py-2 mx-auto max-w-7xl xl:px-0">
				<div className="flex items-center space-x-8">
					<Link href="/">
						<Image
							alt="Logo"
							src={"/assets/images/jasamarga.png"}
							width={200}
							height={40}
						/>
					</Link>
					<div className="flex flex-row space-x-2.5 ">
						{Menu?.map((menu: any, i: number) => (
							<div key={i}>
								<Link
									href={menu.link}
									className={`text-base capitalize ${
										pathname === menu.link
											? "font-bold text-brand"
											: " text-gray-900"
									}`}
								>
									{menu.name}
								</Link>
							</div>
						))}
					</div>
				</div>
				<div className="flex items-center space-x-5">
					<Dropdown>
						<UserCircleIcon className="w-10 h-10 text-gray-900" />
						<div className="flex flex-col w-48 py-2">
							<button className="px-4 py-2 text-left hover:bg-gray-100">
								Account
							</button>
							<button
								onClick={Logout}
								className="flex items-center px-4 py-2 space-x-2 text-left hover:bg-gray-100"
							>
								<span className="text-danger-600">Logout</span>
								<ArrowLeftOnRectangleIcon className="w-5 h-5 text-gray-900" />
							</button>
						</div>
					</Dropdown>
					<Cog6ToothIcon className="w-8 h-8 text-gray-900 " />
				</div>
			</div>
		</nav>
	);
};
