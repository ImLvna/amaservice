import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import type { ExtendedSession } from '$lib/types/auth';
import type { Settings } from '@prisma/client';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const session = (await locals.auth()) as ExtendedSession;

	if (!session?.user && url.pathname.startsWith('/dashboard')) {
		return redirect(301, '/login');
	}

	if (session?.user && url.pathname.startsWith('/login')) {
		return redirect(301, '/dashboard');
	}

	const returnVal: {
		session: ExtendedSession;
		settings?: Settings;
	} = {
		session
	};

	if (session?.user) {
		let settings = await prisma.settings.findUnique({
			where: {
				userId: session.user.id
			}
		});

		if (!settings) {
			settings = await prisma.settings.create({
				data: {
					userId: session.user.id
				}
			});
		}
		returnVal.settings = settings;
	}

	return returnVal;
};
