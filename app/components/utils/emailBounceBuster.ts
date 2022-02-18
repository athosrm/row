type Email = { email: string };

export async function emailBounceBuster({ email }: Email) {
	const API = 'https://api.bouncebuster.io/v1/verify';

	const res = await fetch(`${API}/${email}`, {
		method: 'post',
		body: JSON.stringify({}),
		headers: {
			Authorization: '69bebadf-aa3e-4527-8f80-c35c97be10c6',
			'Content-Type': 'application/vnd.api+json; charset=utf-8',
		},
	});
	console.log(res);
	return res.json();
}
