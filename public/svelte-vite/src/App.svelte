<script>
  import { onMount } from 'svelte';

  let message = '';

  onMount(async () => {
    const res = await fetch('/api/hello');
    const data = await res.json();
    message = data.message;
  });

  const loadApi = async () => {
    const res = await fetch('/api/hello');
    const data = await res.json();
    message = data.message;
  };
</script>

<h1>Svelte + Vite SPA</h1>

<div class="api-status">
  {#if message}
    <p>{message}</p>
  {:else}
    <p>Click to load API data</p>
  {/if}
</div>

<button on:click={loadApi}>Load from /api/hello</button>