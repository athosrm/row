import type { ActionFunction, LinksFunction } from 'remix';
import { Form } from 'remix';
import stylesUrl from './SignInUp.css';

export const links: LinksFunction = () => {
	return [{ rel: 'stylesheet', href: stylesUrl }];
};

export default function SignInUp() {
	return (
		<div className="card signinup">
			<Form method="post">
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
						<span>Recuperar senha, informar email.</span>
					</div>
				</div>

				<div className="buttons">
					<button type="submit" className="button entrar">
						Entrar
					</button>
					<button type="submit" className="button cadastrar">
						Criar conta
					</button>
				</div>

				<span className="conta">Para criar conta, informar somente e-mail. É gratuito.</span>

				<div className="termos">
					<p>
						Leia nossos <a>Termos de Uso</a>
						{' e '}
						<a>Política de Privacidade</a>. Ao continuar usando nossos serviços você concorda com
						nossos termos e política.
					</p>
				</div>
			</Form>
		</div>
	);
}
