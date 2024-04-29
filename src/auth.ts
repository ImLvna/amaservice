import { SvelteKitAuth } from '@auth/sveltekit';
import twitter from '@auth/sveltekit/providers/twitter';

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [twitter]
});
