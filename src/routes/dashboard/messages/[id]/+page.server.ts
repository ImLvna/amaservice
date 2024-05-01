import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import type { ExtendedSession } from '$lib/types/auth';

export const load: PageServerLoad = async ({ locals, params }) => {
	const session = (await locals.auth()) as ExtendedSession;
	if (!session) return redirect(302, '/login');

	const message = await prisma.message.findUnique({
		where: {
			id: params.id
		}
	});

	if (!message) {
		return error(404, 'Message not found');
	}

	if (!message.read) {
		await prisma.message.update({
			where: {
				id: params.id
			},
			data: {
				read: true
			}
		});
		message.read = true;
	}

	const reply = await prisma.messageResponse.findUnique({
		where: {
			messageId: message.id
		}
	});

	return {
		message,
		reply
	};
};

export const actions: Actions = {
	reply: async ({ request, locals }) => {
		const session = (await locals.auth()) as ExtendedSession;
		if (!session) return redirect(302, '/login');

		const body = await request.formData();

		const messageId = body.get('messageId') as string;
		const reply = body.get('reply') as string;

		if (!messageId) {
			return fail(400, { messageId, missing: true });
		}
		if (!reply) {
			return fail(400, { reply, missing: true });
		}

		if (reply.length > 500) {
			return fail(400, { reply, tooLong: true });
		}

		if (reply.length < 1) {
			return fail(400, { reply, tooShort: true });
		}

		const message = await prisma.message.findFirst({
			where: {
				id: messageId
			}
		});

		if (!message) {
			return fail(404, { messageId, notFound: true });
		}

		if (message.userId !== session.user.id) {
			return fail(403, { messageId, notAllowed: true });
		}

		await prisma.messageResponse.create({
			data: {
				response: reply,
				messageId
			}
		});

		return { success: true };
	}
};
