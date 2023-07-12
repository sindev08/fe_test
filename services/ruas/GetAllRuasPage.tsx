import axios from "axios";

export default async function GetAllRuasPage(page: number) {
	try {
		const result = await axios({
			method: "GET",
			url: process.env.NEXT_PUBLIC_BASE_URL + `/api/ruas?page=${page}`,
			headers: {
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
			},
		});
		return result;
	} catch (err) {
		return err;
	}
}
