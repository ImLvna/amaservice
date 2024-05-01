import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import type { ExtendedSession } from '$lib/types/auth';

export const load: PageServerLoad = async ({ locals }) => {
	const session = (await locals.auth()) as ExtendedSession;
	if (!session) return redirect(302, '/login');

	console.log(session);

	const messages = await prisma.message.findMany({
		where: {
			targetUserName: session.user?.username
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	return {
		messages
	};
};
