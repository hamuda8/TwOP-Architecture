import { onMount } from 'svelte'

onMount(async () => {
  const { data } = await fetch('/api/hello').then(r => r.json())
  message = data.message
})

let message = ''