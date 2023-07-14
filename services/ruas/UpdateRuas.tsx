import axios from "axios";
import { NextApiRequest } from "next";

export default async function UpdateRuas(data: NextApiRequest, id: number) {
	try {
		const result = await axios({
			method: "POST",
			url: process.env.NEXT_PUBLIC_BASE_URL + "/api/ruas/" + id,
			data,
		});
		return result;
	} catch (err) {
		return err;
	}
}
