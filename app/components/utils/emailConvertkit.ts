type Email = { email: string };

export async function emailConvertKit({ email }: Email) {
	const KEY = process.env.CONVERTKIT_KEY;
	const FORM = process.env.CONVERTKIT_FORM;
	const API = 'https://api.convertkit.com/v3';

	const res = await fetch(`${API}/forms/${FORM}/subscribe`, {
		method: 'post',
		body: JSON.stringify({ email, api_key: KEY }),
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
	});
	console.log(res);
	return res.json();
}
