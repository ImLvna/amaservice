import { prisma } from '$lib/server/db';
import { error, json, type RequestHandler } from '@sveltejs/kit';

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
			messageId: params.messageId
		}
	});

	return json({
		...message,
		response
	});
};
