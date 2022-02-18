type Email = { email: string };

export async function emailZeroBounce({ email }: Email) {
	const KEY = process.env.ZEROBOUNCE_KEY;
	const API = 'https://api.zerobounce.net/v2/validate?';
	const IP = '156.124.12.145';

	const res = await fetch(`${API}api_key=${KEY}&email=${email}&ip_address=${IP}`, {
		method: 'get',
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
	});
	console.log(res);
	return res.json();
}
