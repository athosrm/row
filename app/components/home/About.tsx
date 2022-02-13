import type { LinksFunction } from 'remix';
import { Link } from 'remix';
import stylesUrl from './About.css';

export const links: LinksFunction = () => {
	return [{ rel: 'stylesheet', href: stylesUrl }];
};

export default function About() {
	return (
		<div className="card about">
			<div className="logo">
				<Link to="/" title="Referências Organizadas">
					<img src="images/REFERENCIAS.png" alt="Logo" />
				</Link>
				<div>
					<Link to="/documents">Documentos</Link>
				</div>
			</div>
			<div>
				<h1>REFERÊNCIAS ORGANIZADAS</h1>
				<h2>Organize seus links, arquivos e informações diversas</h2>
			</div>
			<p>
				Na web encontramos diversas informações de nosso interesse (notícias, vídeos, músicas,
				imagens, informações técnicas, dicas de viagens, de compras, receitas...) cujas referências
				(links ou arquivos) queremos guardar para acessar novamente. Também guardamos informações
				próprias em computadores, celulares, pen drives ou em repositórios na nuvem.
			</p>
			<p>
				Como as referências a essas informações estão catalogadas e organizadas? Existe
				relacionamento entre elas? Como e o que se faz para achar uma referência guardada?
			</p>
			<p>
				Aqui todo esse conjunto de informações e referências podem ser organizadas e relacionadas de
				forma simples. O resultado será a possibilidade da realização de pesquisas rápidas e
				complexas gerando catálogos e listas de acordo com os atributos indicados para a pesquisa.
				Seus arquivos continuarão onde estão e como estão, somente as referências a eles é que serão
				organizadas e relacionadas.
			</p>
			{/* <p>Ações no presente preparando seu futuro!</p> */}
			<p>O amanhã é preparado nas ações do presente!</p>
			<h2>Crie sua conta!</h2>
			<div className="footer">
				<span>&copy; 2022 - NG Systems & Designs Technologies</span>
			</div>
		</div>
	);
}
