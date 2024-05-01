<script lang="ts">
  import "./app.css";

  const { children } = $props();
</script>

<div class="size-full">
  {@render children()}
</div>

<style lang="postcss">
  :global(html, body) {
    @apply size-full;
  }
</style>