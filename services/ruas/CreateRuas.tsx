import axios from "axios";

export default async function CreateRuas(token: string, data: any) {
	try {
		const result = await axios({
			method: "POST",
			url: process.env.NEXT_PUBLIC_BASE_URL + `/api/ruas`,
			headers: {
				Authorization: `Bearer ${token}`,
			},
			data,
		});
		return result;
	} catch (err) {
		return err;
	}
}
