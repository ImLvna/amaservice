import { prisma } from '$lib/server/db';
import getUser from '$lib/server/users';
import { escape } from '$lib/utils';
import { error, type RequestHandler } from '@sveltejs/kit';
import sharp from 'sharp';

export const GET: RequestHandler = async ({ params, locals }) => {
	const user = await getUser({
		username: params.user,
		session: locals.auth
	});

	if (!user) {
		return error(404, 'User not found');
	}

	const settings = await prisma.settings.findUnique({
		where: {
			userId: user.id
		}
	});

	if (!settings) {
		return error(404, 'Settings not found');
	}

	const svg = `<svg width="1000" height="600" viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg">
	<rect width="1000" height="600" rx="100" fill="url(#paint0_linear_4_7)"/>
	<defs>
	<linearGradient id="paint0_linear_4_7" x1="0" y1="0" x2="1035.4" y2="69.0266" gradientUnits="userSpaceOnUse">
	<stop stop-color="${settings.color1}"/>
	<stop offset="1" stop-color="${settings.color2}"/>
	</linearGradient>
	</defs>
	</svg>
	
  
  `;

	const text = sharp({
		text: {
			text: `<span foreground="white">${escape(settings.prompt)}</span>`,
			font: 'sans-serif',
			dpi: 600,
			rgba: true,
			align: 'centre',
			justify: true
		}
	}).toFormat('png');

	const img = sharp(Buffer.from(svg, 'utf-8'))
		.composite([
			{
				input: await text.toBuffer(),
				gravity: 'center'
			}
		])
		.toFormat('png');

	return new Response(await img.toBuffer(), {
		headers: {
			'Content-Type': 'image/png'
		}
	});
};
