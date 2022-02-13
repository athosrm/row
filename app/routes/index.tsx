import { ActionFunction, LinksFunction, useActionData, useTransition } from 'remix';
import { Form, Link } from 'remix';
import About, { links as stylesAbout } from '~/components/home/About';
import stylesUrl from '../styles/index.css';

export const links: LinksFunction = () => {
	return [{ rel: 'stylesheet', href: stylesUrl }, ...stylesAbout()];
};

export const action: ActionFunction = async ({ request }) => {
	await new Promise((res) => setTimeout(res, 1000)); // Para demorar afim de poder ver o submitting agindo
	const formData = await request.formData();
	const email = formData.get('email');
	const senha = formData.get('senha');
	console.log(formData);

	if (formData.has('entrar')) {
		console.log('ENTRAR');
	} else if (formData.has('criar')) {
		console.log('CRIAR');
	}

	const API_KEY = '...';
	const FORM_ID = '...';
	const API = 'https://api.convertkit.com/v3';

	const res = await fetch(`${API}/forms/${FORM_ID}/subscribe`, {
		method: 'post',
		body: JSON.stringify({ email, api_key: API_KEY }),
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
	});

	// return { ok: true };
	return res.json();
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
