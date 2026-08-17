<script>
  let message = ''

  import { onMount } from 'svelte'

  onMount(async () => {
    const { data } = await fetch('/api/hello').then(r => r.json())
    message = data.message
  })
</script>

<h1>Svelte + Vite SPA</h1>

<div class="api-status">
  {#if message}
    <p>{message}</p>
  {:else}
    <p>Click to load API data</p>
  {/if}
</div>

<button on:click="{async () => { const { data } = await fetch('/api/hello').then(r => r.json()); message = data.message }}">Load from /api/hello</button>