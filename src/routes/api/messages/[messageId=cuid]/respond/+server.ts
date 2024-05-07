import { prisma } from '$lib/server/db';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ params, locals, request }) => {
	const message = await prisma.message.findUnique({
		where: {
			id: params.messageId
		}
	});

	if (!message) {
		return error(404, 'Message not found');
	}

	const session = await locals.auth();

	if (!session?.user) {
		return error(401, 'Unauthorized');
	}

	if (message.userId !== session.user.id) {
		return error(401, 'Unauthorized');
	}

	const response = await prisma.messageResponse.findUnique({
		where: {
			messageId: params.messageId
		}
	});

	if (response) {
		return error(400, 'Response already exists');
	}

	const body: {
		response: string;
	} = await request.json();

	if (!body.response) {
		return error(400, 'Response is required');
	}

	if (body.response.length > 500) {
		return error(400, 'Response is too long');
	}

	if (body.response.length < 1) {
		return error(400, 'Response is too short');
	}

	await prisma.messageResponse.create({
		data: {
			response: body.response,
			messageId: params.messageId!
		}
	});

	const newMessage = await prisma.message.findUnique({
		where: {
			id: params.messageId
		}
	})!;

	return json(newMessage);
};
