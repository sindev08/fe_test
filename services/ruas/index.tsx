import axios from "axios";
import { NextApiRequest } from "next";

export default async function GetAllRuas(
	token: string,
	per_page: number,
	page: number
) {
	try {
		const result = await axios({
			method: "GET",
			url:
				process.env.NEXT_PUBLIC_BASE_URL +
				`/api/ruas?per_page=${per_page}&page=${page}`,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return result;
	} catch (err) {
		return err;
	}
}
