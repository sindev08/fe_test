import axios from "axios";

export default async function DeleteRuas(token: string, id: number) {
	try {
		const result = await axios({
			method: "DELETE",
			url: process.env.NEXT_PUBLIC_BASE_URL + `/api/ruas/` + id,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return result;
	} catch (err) {
		return err;
	}
}
