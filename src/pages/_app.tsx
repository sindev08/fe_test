import Head from "next/head";
import { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import "../styles/index.css";
import { CustomToastContainer } from "../../components/Toast";
import CookieWatcher from "../../components/CookieWatcher";
import { useEffect } from "react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();
	useEffect(() => {
		const isLoggedIn = getCookie("token");

		if (!isLoggedIn) {
			// Jika cookie 'token' tidak ditemukan, arahkan ke halaman login
			router.push("/login");
		}
	}, []);
	return (
		<>
			<Head>
				<title>Website Frontend Dev Test</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<NextNProgress
				color="#1976D2"
				startPosition={0.3}
				stopDelayMs={200}
				height={2}
				showOnShallow={true}
			/>
			<Component {...pageProps} />
			<CustomToastContainer />
		</>
	);
}

export default MyApp;
