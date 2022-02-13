import { LinksFunction, MetaFunction, Scripts, Link } from 'remix';
import { Links, LiveReload, Outlet, useCatch, Meta } from 'remix';

import globalStylesUrl from './styles/global.css';
import globalMediumStylesUrl from './styles/global-medium.css';
import globalLargeStylesUrl from './styles/global-large.css';

export const links: LinksFunction = () => {
	return [
		{
			rel: 'stylesheet',
			href: globalStylesUrl,
		},
		{
			rel: 'stylesheet',
			href: globalMediumStylesUrl,
			media: 'print, (min-width: 640px)',
		},
		{
			rel: 'stylesheet',
			href: globalLargeStylesUrl,
			media: 'screen and (min-width: 1024px)',
		},
	];
};

export const meta: MetaFunction = () => {
	const description = `Referências Organizadas - links, arquivos, textos e informações organizados`;
	return {
		description,
		keywords: 'Referências,organizadas',
		'facebook:page': 'Referências_Organizadas',
		'facebook:description': description,
		'instagram:page': 'Organized_References',
		'instagram:description': 'Organized References - links, file, texts and informations',
	};
};

export default function App() {
	return (
		<Document>
			<Outlet />
		</Document>
	);
}

function Document({
	children,
	title = `Referências Organizadas`,
}: {
	children: React.ReactNode;
	title?: string;
}) {
	return (
		<html lang="pt-BR">
			<head>
				<meta charSet="utf-8" />
				<Meta />
				<title>{title}</title>
				<Links />
			</head>
			<body>
				{children}
				{/* <Scripts /> */}
				{process.env.NODE_ENV === 'development' ? <LiveReload /> : null}
			</body>
		</html>
	);
}

// function Layout({ children }: { children: React.ReactNode }) {
// 	return (
// 		<div>
// 			<header>
// 				<div>
// 					<Link to="/" title="Referências Organizadas">
// 						<img src="images/REFERENCIAS.png" alt="Logo" />
// 					</Link>
// 				</div>
// 				<div>
// 					<nav>
// 						<ul>
// 							<li>
// 								<Link to="/documents">Docs</Link>
// 							</li>
// 						</ul>
// 					</nav>
// 				</div>
// 			</header>
// 			<div>
// 				<div>{children}</div>
// 			</div>
// 			<footer>
// 				<div>
// 					<p>&copy; You!</p>
// 				</div>
// 			</footer>
// 		</div>
// 	);
// }

export function CatchBoundary() {
	const caught = useCatch();
	return (
		<Document title={`${caught.status} ${caught.statusText}`}>
			<div className="error-container">
				<h1>
					{caught.status} {caught.statusText}
				</h1>
			</div>
		</Document>
	);
}

export function ErrorBoundary({ error }: { error: Error }) {
	console.error(error);
	return (
		<Document title="Referências Organizadas - Uh-oh!">
			<div className="error-container">
				<h1>App Error</h1>
				<pre>{error.message}</pre>
			</div>
		</Document>
	);
}
