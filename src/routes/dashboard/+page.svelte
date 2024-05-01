<script lang="ts">
	const { data } = $props();
</script>

<div>
	{#each data.messages as message}
		<a href={`/dashboard/messages/${message.id}`}>
			{#if !message.read}
				<div>New Message</div>
			{:else}
				<div>{message.message}</div>
			{/if}
		</a>
	{/each}
</div>
