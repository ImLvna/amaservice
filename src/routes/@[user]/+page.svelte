<script lang="ts">
	import { page } from '$app/stores';

	const { data } = $props();
</script>

<div>
	<img src={data.user.image} alt={data.user.name} />
	<h1>{data.user.name}</h1>
</div>
