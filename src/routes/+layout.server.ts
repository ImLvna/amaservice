import type { ExtendedSession } from '$lib/types/session';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const session: ExtendedSession = (await event.locals.auth()) as ExtendedSession;

	console.log('session', session);

	if (!session && !event.url.pathname.startsWith('/login')) {
		return redirect(301, '/login');
	}

	if (session && event.url.pathname.startsWith('/login')) {
		return redirect(301, '/');
	}

	return {
		session
	};
};
