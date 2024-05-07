import { prisma } from '$lib/server/db';
import getUser from '$lib/server/users';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, locals }) => {
	const user = await getUser({
		username: params.user,
		session: locals.auth
	});

	if (!user) {
		return error(404, 'User not found');
	}

	const messages = await Promise.all(
		(
			await prisma.message.findMany({
				where: {
					userId: user.id
				},
				orderBy: {
					createdAt: 'desc'
				}
			})
		).map(async (message) => {
			return {
				...message,
				response: await prisma.messageResponse.findUnique({
					where: {
						messageId: message.id
					}
				})
			};
		})
	);

	return json({ messages });
};
