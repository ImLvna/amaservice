import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import type { ExtendedSession } from '$lib/types/auth';

export const load: PageServerLoad = async ({ locals }) => {
	const session = (await locals.auth()) as ExtendedSession;
	if (!session?.user) return redirect(302, '/login');

	const messages = await prisma.message.findMany({
		where: {
			userId: session.user?.id
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	return {
		messages
	};
};
