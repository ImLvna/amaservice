import type { Session } from '@auth/sveltekit';
import type { User } from '@prisma/client';

export interface ExtendedSession extends Session {
	user: User;
}
