import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { ExtendedSession } from '$lib/types/auth';
import { prisma } from '$lib/server/db';
import type { Settings } from '@prisma/client';

export const load: PageServerLoad = async ({ locals }) => {
	const session = (await locals.auth()) as ExtendedSession;
	if (!session?.user) return redirect(302, '/login');

	const settings = await prisma.settings.findUnique({
		where: {
			userId: session.user.id
		}
	})!;

	return { settings };
};

export const actions = {
	default: async ({ request, locals }) => {
		const session = (await locals.auth()) as ExtendedSession;
		if (!session?.user) return redirect(302, '/login');

		const settings = (await prisma.settings.findUnique({
			where: {
				userId: session.user.id
			}
		})) as Settings;

		const formData = await request.formData();

		const prompt = formData.get('prompt') as string;
		const color1 = formData.get('color1') as string;
		const color2 = formData.get('color2') as string;

		if (prompt) settings.prompt = prompt;
		if (color1) settings.color1 = color1;
		if (color2) settings.color2 = color2;

		await prisma.settings.update({
			where: {
				userId: session.user.id
			},
			data: settings
		});
	}
} satisfies Actions;
