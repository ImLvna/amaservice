import type { ExtendedSession } from '$lib/types/auth';
import type { User } from '@prisma/client';
import { prisma } from './db';
import type { Session } from '@auth/sveltekit';

interface GetUserProps {
	id?: string;
	username?: string;
	session?: (ExtendedSession | null) | (() => Promise<Session | null>);
}
export default async function getUser(props: GetUserProps): Promise<User | null> {
	let { session } = props;
	const { id, username } = props;
	if (username === 'me') {
		if (typeof session === 'function') {
			session = (await session()) as ExtendedSession | null;
		}
		if (!session?.user) {
			throw new Error('You must be logged in to do that');
		}
		return session.user;
	}
	if (id) {
		return await prisma.user.findUnique({
			where: {
				id
			}
		});
	}
	if (username) {
		return await prisma.user.findUnique({
			where: {
				username
			}
		});
	}
	return null;
}
