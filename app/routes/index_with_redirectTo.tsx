import { ActionFunction, LinksFunction, MetaFunction } from 'remix';
import { Form, Link, useActionData, useTransition, json } from 'remix';
import About, { links as stylesAbout } from '~/components/home/About';
import { createUserSession, login, signup } from '~/components/utils/dbServices';
import stylesUrl from '../styles/index.css';

export const links: LinksFunction = () => {
	return [{ rel: 'stylesheet', href: stylesUrl }, ...stylesAbout()];
};

export const meta: MetaFunction = () => {
	return {
		title: 'ROW | About - Login',
		description: 'Referencias organizadas na WEB - About page - Login and Sign up',
	};
};

function validateEmail(email: unknown) {
	if (typeof email !== 'string' || email.length < 5) {
		return `Email must be at least 5 characters long`;
	}
	if (!email.includes('@')) {
		return `Enter an email`;
	}
}

function validatePassword(password: unknown) {
	if (typeof password !== 'string' || password.length < 8) {
		return `Password must be at least 8 characters long`;
	}
}

type ActionData = {
	formError?: string;
	fieldErrors?: {
		email: string | undefined;
		password: string | undefined;
	};
	fields?: {
		email: string;
		password: string;
	};
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
	// Para demorar afim de poder ver o submitting agindo
	await new Promise((res) => setTimeout(res, 1000));

	const form = await request.formData();
	const email = form.get('email');
	const password = form.get('senha');
	const redirectTo = form.get('redirectTo') || '/references';
	//console.log(formData);
	if (typeof email !== 'string' || typeof password !== 'string' || typeof redirectTo !== 'string') {
		return badRequest({ formError: `Formulário não submetido corretamente.` });
	}

	const fields = { email, password };
	const fieldErrors = {
		email: validateEmail(email),
		password: validatePassword(password),
	};
	if (Object.values(fieldErrors).some(Boolean)) {
		return badRequest({ fieldErrors, fields });
	}

	if (form.has('entrar')) {
		// login to get the user
		// if there's no user, return the fields and a formError
		// if there is a user, create their session and redirect to /jokes
		const user = await login({ email, password });
		console.log({ user });
		if (!user) {
			return badRequest({
				fields,
				formError: `Email/Senha incorretas. Verifique.`,
			});
		}
		return createUserSession(user.enrolledid, redirectTo);
	} else if (form.has('criar')) {
		// create the contact
		const contact = await signup({ email });
		if (!contact) {
			return badRequest({
				fields,
				formError: `Something went wrong trying to create a new contact.`,
			});
		}
		return createUserSession(user.id, redirectTo);
	} else {
		return badRequest({
			fields,
			formError: `Ação não identificada!!!`,
		});
	}

	// return { ok: true };
	// return res.json();
};

export default function Index() {
	const actionData = useActionData();
	const transition = useTransition();
	const state: 'idle' | 'success' | 'error' | 'submitting' = transition.submission
		? 'submitting'
		: actionData?.subscription
		? 'success'
		: actionData?.error
		? 'error'
		: 'idle';

	return (
		<div className="grid">
			<About />
			{/* <SignInUp /> */}
			<div className="card signinup">
				<Form replace method="post" aria-hidden={state === 'success'}>
					<div>
						<div className="input">
							<label htmlFor="email">Email</label>
							<input type="email" id="email" name="email" required />
						</div>

						<div className="input">
							<label htmlFor="senha">Senha</label>
							<input id="senha" name="senha" type="password" />
						</div>

						<div className="esqueci">
							<Link to="/Esqueci">Esqueci a senha</Link>
						</div>
					</div>
					<div className="buttons">
						<button type="submit" name="entrar" className="button entrar">
							Entrar
						</button>
						<button type="submit" name="criar" className="button cadastrar">
							{state === 'submitting' ? 'Criando conta...' : 'Criar conta'}
						</button>
					</div>
					<span className="conta">Crie sua conta informando somente e-mail. É gratuito.</span>
					<div className="termos">
						<p>
							Leia nossos <Link to="/Termos">Termos de Uso e Política de Privacidade</Link>. Ao
							continuar usando nossos serviços você concorda com nossos Termos de Uso e Política de
							Privacidade.
						</p>
					</div>
					<p id="error-message">{state === 'error' ? actionData.message : <>&nbsp;</>}</p>
				</Form>

				{/* <div aria-hidden={state !== 'success'}>
					<h2 tabIndex={-1}>You're subscribed!</h2>
					<p>Please check your email to confirm your subscription.</p>
					<Link to=".">Start over</Link>
				</div> */}
			</div>
		</div>
	);
}
