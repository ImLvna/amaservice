import { prisma } from '$lib/server/db';
import getUser from '$lib/server/users';
import { escape } from '$lib/utils';
import { error, type RequestHandler } from '@sveltejs/kit';
import sharp from 'sharp';

export const GET: RequestHandler = async ({ params }) => {
	const message = await prisma.message.findUnique({
		where: {
			id: params.messageId
		}
	});

	if (!message) {
		return error(404, 'Message not found');
	}

	const response = await prisma.messageResponse.findUnique({
		where: {
			messageId: message.id
		}
	});

	if (!response) {
		return error(404, 'Response not found');
	}

	const user = await getUser({
		id: message.userId
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
  <rect width="1000" height="600" rx="100" fill="white"/>
  <rect width="1000" height="200" fill="url(#paint0_linear_1_2)"/>
  <defs>
  <linearGradient id="paint0_linear_1_2" x1="0" y1="0" x2="1000" y2="200" gradientUnits="userSpaceOnUse">
  <stop stop-color="${settings.color1}"/>
  <stop offset="1" stop-color="${settings.color2}"/>
  </linearGradient>
  </defs>
  </svg>
  
  `;

	const banner = sharp({
		create: {
			width: 1000,
			height: 200,
			channels: 4,
			background: { r: 0, g: 0, b: 0, alpha: 0 }
		}
	});

	const text = sharp({
		text: {
			text: `<span foreground="white">${escape(message.message)}</span>`,
			font: 'sans-serif',
			dpi: 300,
			rgba: true,
			align: 'centre',
			justify: true
		}
	}).toFormat('png');

	// Overlay text in the center of banner
	const overlayBanner = banner
		.composite([
			{
				input: await text.toBuffer(),
				gravity: 'centre'
			}
		])
		.toFormat('png');

	const bodyText = sharp({
		text: {
			text: `<span foreground="black">${response.response}</span>`,
			font: 'sans-serif',
			dpi: 300,
			width: 1000,
			rgba: true,
			align: 'centre',
			justify: true
		}
	}).toFormat('png');

	const img = sharp(Buffer.from(svg, 'utf-8'))
		.composite([
			{
				input: await overlayBanner.toBuffer(),
				gravity: 'north'
			},
			{
				input: await bodyText.toBuffer()
			}
		])
		.toFormat('png');

	return new Response(await img.toBuffer(), {
		headers: {
			'Content-Type': 'image/png'
		}
	});
};
