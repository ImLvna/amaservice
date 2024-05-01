<script lang="ts">
	const { data } = $props();
</script>

<div>
	<div>
		{data.message.message}
	</div>
	{#if !data.reply}
		<form action="?/reply" method="post">
			<input type="hidden" name="messageId" value={data.message.id} />
			<textarea name="reply" placeholder="Reply"></textarea>
			<button type="submit">Reply</button>
		</form>
	{:else if data.reply}
		<div>
			{data.reply.response}
		</div>
	{/if}
</div>
