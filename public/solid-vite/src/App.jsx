<script hydrating="ssr" ssr>
import { createSignal } from 'solid-js'

const [message, setMessage] = createSignal('')

onMount(async () => {
  const res = await fetch('/api/hello')
  const data = await res.json()
  setMessage(data.message)
})
</script>

<h1>SolidJS + Vite SPA</h1>

<div class="api-status">
  {message()} ? <p>{message()}</p> : <p>Click to load API data</p>
</div>

<button onClick={() => fetch('/api/hello').then(res => res.json()).then(data => setMessage(data.message))}>Load from /api/hello</button>