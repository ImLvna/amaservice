import { AUTH_TWITTER_ID, AUTH_TWITTER_SECRET } from '$env/static/private';
import { SvelteKitAuth } from '@auth/sveltekit';
import Twitter from '@auth/sveltekit/providers/twitter';

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [
		Twitter({
			clientId: AUTH_TWITTER_ID,
			clientSecret: AUTH_TWITTER_SECRET,
			userinfo: 'https://api.twitter.com/2/users/me?user.fields=profile_image_url,id,username',
			profile({ data }) {
				console.log(data);
				return {
					id: data.id,
					name: data.name,
					username: data.username,
					image: data.profile_image_url
				};
			}
		})
	],
	// adapter: PrismaAdapter(prisma),
	callbacks: {
		session(a) {
			console.log('session', a);
			return a.session;
		}
	}
});
