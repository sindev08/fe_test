import axios from "axios";

export default async function PostLogout(data: any) {
	try {
		const result = await axios({
			method: "POST",
			url: process.env.NEXT_PUBLIC_BASE_URL + "/api/logout",
			data,
		});
		return result;
	} catch (err) {
		return err;
	}
}
