import Head from "next/head";
import { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import "../styles/index.css";
import { CustomToastContainer } from "../../components/Toast";

function MyApp({ Component, pageProps }: AppProps) {
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
