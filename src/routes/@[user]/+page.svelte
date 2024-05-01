<script lang="ts">
	import { page } from '$app/stores';

	const { data, form } = $props();
</script>

{#if form?.success}
	<p>Message sent!</p>
	<button onclick={() => location.reload()}>Send another</button>
{/if}

{#if !form?.success}
	{#if (form?.missing && form?.message) || form?.tooShort}
		<p>Message is required.</p>
	{/if}

	{#if form?.missing && form?.username}
		<p>Username is required.</p>
	{/if}

	{#if form?.tooLong}
		<p>Please keep your messages under 140 characters ^.^</p>
	{/if}

	{#if form?.rateLimited}
		<p>Woah there! You're sending messages too quickly.</p>
	{/if}
{/if}
{#if !form}
	<div>
		<img src={data.user.image} alt={data.user.name} />
		<h1>{data.user.name}</h1>

		<form method="POST">
			<input type="text" name="username" value={data.user.username} hidden />
			<input type="text" name="message" placeholder="Message" />
			<button type="submit">Send</button>
		</form>
	</div>
{/if}
