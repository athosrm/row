import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function seed() {
	const arm = await db.enrolled.create({
		data: {
			name: 'arm',
			email: 'arm@gmail.com',
			// This is a hashed version of "kiki@soso#ashe"
			password: 'AC7A40D1920CBF79E4974ED9218F7B1902CCE1D6DD0195E5DB20C7D75920B06F',
		},
	});

	await Promise.all(
		getTags().map((tag) => {
			const data = { enrolledid: arm.enrolledid, ...tag };
			return db.tag.create({ data });
		})
	);

	await Promise.all(
		getReferences().map((reference) => {
			const data = { enrolledid: arm.enrolledid, ...reference };
			return db.reference.create({ data });
		})
	);
}

seed();

function getTags() {
	return [
		{
			name: 'Javascript',
		},
		{
			name: 'Remix',
		},
		{
			name: 'Next.js',
		},
		{
			name: 'Prisma',
		},
		{
			name: 'NPM',
		},
		{
			name: 'Node.js',
		},
	];
}

function getReferences() {
	return [
		{
			title: 'Datas',
		},
		{
			title: 'Crash Course',
		},
		{
			title: 'Introducing',
		},
		{
			title: 'Dark mode',
		},
		{
			title: 'Modal',
		},
		{
			title: 'Image',
		},
	];
}
