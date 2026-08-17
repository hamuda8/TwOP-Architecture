import { createSignal } from 'solid-js'

const [message, setMessage] = createSignal('')

import { onMount } from 'solid-js'

onMount(async () => {
  const res = await fetch('/api/hello')
  const data = await res.json()
  setMessage(data.message)
})