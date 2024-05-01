import { prisma } from '$lib/server/db';
import { error, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getIp } from '$lib/server/utils';
import { RateLimiter } from 'sveltekit-rate-limiter/server';
import { RATELIMIT_KEY } from '$env/static/private';

const limiter = new RateLimiter({
	// A rate is defined as [number, unit]
	IP: [10, 'h'], // IP address limiter
	IPUA: [5, 'm'], // IP + User Agent limiter
	cookie: {
		// Cookie limiter
		name: 'limiterid', // Unique cookie name for this limiter
		secret: RATELIMIT_KEY, // Use $env/static/private
		rate: [2, 'm'],
		preflight: true // Require preflight call (see load function)
	}
});

export const load: PageServerLoad = async (event) => {
	await limiter.cookieLimiter?.preflight(event);

	const user = await prisma.user.findUnique({
		where: {
			username: event.params.user
		}
	});

	if (!user) {
		return error(404, 'User not found');
	}

	return {
		user: {
			username: user.username,
			name: user.name,
			image: user.image
		}
	};
};

export const actions: Actions = {
	default: async (event) => {
		if (await limiter.isLimited(event)) {
			return fail(429, { rateLimited: true });
		}
		const data = await event.request.formData();
		const message = data.get('message') as string;
		if (!message) {
			return fail(400, { message, missing: true });
		}
		const username = data.get('username') as string;
		if (!username) {
			return fail(400, { username, missing: true });
		}

		if (message.length > 140) {
			return fail(400, { message, tooLong: true });
		}

		if (message.length < 1) {
			return fail(400, { message, tooShort: true });
		}

		await prisma.message.create({
			data: {
				message,
				targetUserName: username,
				ip: getIp(event),
				userAgent: event.request.headers.get('user-agent') || 'unknown'
			}
		});

		return {
			success: true
		};
	}
};
