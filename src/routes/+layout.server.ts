import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const session = await locals.auth();

	if (!session && url.pathname.startsWith('/dashboard')) {
		return redirect(301, '/login');
	}

	if (session && url.pathname.startsWith('/login')) {
		return redirect(301, '/dashboard');
	}

	return {
		session
	};
};
