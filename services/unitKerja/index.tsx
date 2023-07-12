import axios from "axios";
import { NextApiRequest } from "next";

export default async function GetAllUnitKerja(token: NextApiRequest) {
	try {
		const result = await axios({
			method: "GET",
			url: process.env.NEXT_PUBLIC_BASE_URL + "/api/unit",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return result;
	} catch (err) {
		return err;
	}
}
