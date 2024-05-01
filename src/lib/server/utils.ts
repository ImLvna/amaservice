import type { RequestEvent } from '@sveltejs/kit';

export function getIp(event: RequestEvent) {
	return event.request.headers.get('x-forwarded-for') || event.getClientAddress();
}
