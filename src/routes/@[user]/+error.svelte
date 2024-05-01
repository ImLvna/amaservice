<script lang="ts">
	import { page } from '$app/stores';
</script>

{$page.status}
{#if $page.status === 404}
	<p>Sorry, that user doesn't exist.</p>
{/if}
