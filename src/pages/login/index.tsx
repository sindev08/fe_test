import Head from "next/head";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { Button } from "../../../components/Button";
import PostLogin from "../../../services/login";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";

export default function Login() {
	const [passwordShow, setPasswordShow] = useState(false);
	const usernameRef = useRef(null);
	const passwordRef = useRef(null);
	const { replace } = useRouter();

	const handleLogin = async () => {
		var name = usernameRef.current.value;
		var password = passwordRef.current.value;
		if (name.length == 0 || password.length == 0) {
			alert("Username dan Password belum terisi!");
		} else {
			const data = new FormData();
			data.append("username", name);
			data.append("password", password);
			const result = await PostLogin(data);
			if (result.status == 200) {
				alert("Anda berhasil masuk");
				setCookie("token", result?.data?.access_token, {
					maxAge: result?.data?.expires_in,
				});
				replace("/");
			} else {
				alert("Username atau Password Anda salah!");
				console.log(result?.message);
			}
		}
	};

	return (
		<div className="flex flex-row w-full h-screen">
			<Head>
				<title>Login</title>
			</Head>
			<div className="flex items-center justify-center w-full px-4 lg:w-1/2 bg-main lg:px-0">
				{/* Card Login */}
				<div className="flex flex-col items-center justify-center max-w-sm px-12 py-8 space-y-8 bg-white rounded-xl">
					<Image
						alt="Logo"
						src={"/assets/images/jasamarga.png"}
						width={300}
						height={60}
					/>
					{/* Input Username */}
					<div className="flex flex-col items-start w-full max-w-xs space-y-2">
						<label className="text-base font-medium text-gray-900">
							Username
						</label>
						<input
							type="text"
							ref={usernameRef}
							className="w-full px-3 py-2 text-gray-900 border border-gray-200 rounded placeholder:text-gray-500 focus:outline-primary-200"
							placeholder="Masukkan Username Anda"
						></input>
					</div>
					{/* End Input Username */}
					{/*  Input Password */}
					<div className="flex flex-col items-start w-full max-w-xs space-y-2">
						<label className="text-base font-medium text-gray-900">
							Password
						</label>
						<div className="relative w-full">
							<input
								className="w-full px-3 py-2 text-gray-900 border border-gray-200 rounded placeholder:text-gray-500 focus:outline-primary-200"
								type={passwordShow ? "text" : "password"}
								ref={passwordRef}
								placeholder="Masukkan Password Anda"
							/>
							<button
								onClick={() => setPasswordShow((prev) => !prev)}
								className="absolute px-1 rounded-full cursor-pointer top-1/4 right-4 bg-white/10 backdrop-blur-md"
							>
								{passwordShow ? (
									<EyeIcon className="w-5 h-5 text-brand" />
								) : (
									<EyeSlashIcon className="w-5 h-5 text-brand" />
								)}
							</button>
						</div>
					</div>
					{/* End Input Password */}
					{/* Button Submit Login */}
					<div className="flex justify-end w-full">
						<Button
							onClick={() => handleLogin()}
							text="Login"
							type="primary"
							className="text-white"
						/>
					</div>
					{/* End Button Submit Login */}
				</div>
			</div>
			{/* Illustration */}
			<div className="items-center justify-center hidden w-1/2 bg-brand lg:flex">
				<Image
					alt="Logo"
					src={"/assets/images/app.png"}
					width={400}
					height={400}
				/>
			</div>
		</div>
	);
}
