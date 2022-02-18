import bcrypt from 'bcryptjs';
import { createCookieSessionStorage, redirect } from 'remix';
import { db } from './dbServer';
import { emailBounceBuster } from './emailBounceBuster';
import { emailZeroBounce } from './emailZeroBounce';

type Email = { email: string };

type LoginForm = {
	email: string;
	password: string;
};

type ConfirmForm = {
	id: string;
	name: string;
	passwordInf: string;
};

export async function signup({ email }: Email) {
	// Verify if email exists in the enrolled table
	const enrolled = await db.enrolled.findUnique({ where: { email } });
	if (enrolled) {
		return 'Email já existe!';
	}

	// Verify if email exists. Zero Bounce or Bounce Buster
	const emailZB = await emailZeroBounce({ email });
	console.log(emailZB);

	const emailBB = await emailBounceBuster({ email });
	console.log(emailBB);

	// Expiration date = today's date plus 2
	const validity = new Date();
	validity.setDate(validity.getDate() + 2);

	// Insert contact
	const contact = await db.contact.create({ data: { validity, email } });
	if (!contact) {
		return 'Erro na criação da conta!';
	}

	// Go to Contact information page to confirm email
	return redirect('/contact');
}

export async function confirm({ id, name, passwordInf }: ConfirmForm) {
	const contact = await db.contact.findUnique({ where: { contactid: id } });
	if (!contact) return null;

	// If the validity data was expired
	if (contact.validity < new Date()) {
		return null;
	}

	// If email was already confirmed
	if (contact.emailok) {
		return null;
	}

	// Verify if email already exist in account base
	const enrolled = await db.enrolled.findUnique({ where: { email: contact.email } });
	if (enrolled) return null;

	// Create email account
	const password = await bcrypt.hash(passwordInf, 10);
	const newAccount = db.enrolled.create({
		data: { email: contact.email, name, password },
	});
	if (!newAccount) return null;
	// return db.enrolled.create({
	// 	data: { email: contact.email, name, password },
	// });

	// Update contact
	const contactUP = await db.contact.update({
		where: { contactid: id },
		data: { emailok: true },
	});
	if (!contactUP) return null;
}

export async function login({ email, password }: LoginForm) {
	const enrolled = await db.enrolled.findUnique({ where: { email } });
	if (!enrolled) return null;

	const isCorrectPassword = await bcrypt.compare(password, enrolled.password);
	if (!isCorrectPassword) return null;

	return createUserSession(enrolled.enrolledid, '/references');
	// return enrolled;
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
	throw new Error('SESSION_SECRET must be set');
}

const storage = createCookieSessionStorage({
	cookie: {
		name: 'RJ_session',
		// normally you want this to be `secure: true`
		// but that doesn't work on localhost for Safari
		// https://web.dev/when-to-use-local-https/
		secure: process.env.NODE_ENV === 'production',
		secrets: [sessionSecret],
		sameSite: 'lax',
		path: '/',
		maxAge: 60 * 60 * 24 * 30,
		httpOnly: true,
	},
});

export function getUserEmail({ email }: Email) {
	return db.enrolled.findUnique({ where: { email } });
}

export function getUserSession(request: Request) {
	return storage.getSession(request.headers.get('Cookie'));
}

export async function getUserId(request: Request) {
	const session = await getUserSession(request);
	const userId = session.get('userId');
	if (!userId || typeof userId !== 'number') return null;
	return userId;
}

export async function requireUserId(
	request: Request,
	redirectTo: string = new URL(request.url).pathname
) {
	const session = await getUserSession(request);
	const userId = session.get('userId');
	if (!userId || typeof userId !== 'number') {
		const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
		throw redirect(`/login?${searchParams}`);
	}
	return userId;
}

export async function getUser(request: Request) {
	const userId = await getUserId(request);
	if (typeof userId !== 'number') {
		return null;
	}

	try {
		const enrolled = await db.enrolled.findUnique({
			where: { enrolledid: userId },
		});
		return enrolled;
	} catch {
		throw logout(request);
	}
}

export async function logout(request: Request) {
	const session = await storage.getSession(request.headers.get('Cookie'));
	return redirect('/login', {
		headers: {
			'Set-Cookie': await storage.destroySession(session),
		},
	});
}

export async function createUserSession(userId: number, redirectTo: string) {
	const session = await storage.getSession();
	session.set('userId', userId);
	return redirect(redirectTo, {
		headers: {
			'Set-Cookie': await storage.commitSession(session),
		},
	});
}
