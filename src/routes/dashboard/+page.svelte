<script lang="ts">
	const { data } = $props();
</script>

<div>
	{#each data.messages as message}
		<div>
			{message.message}
		</div>
	{/each}
</div>
