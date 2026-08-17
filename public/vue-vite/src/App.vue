<script setup>
import { ref, onMounted } from 'vue'

const message = ref('')

const fetchData = async () => {
  const res = await fetch('/api/hello')
  const data = await res.json()
  message.value = data.message
}

onMounted(async () => {
  await fetchData()
})
</script>

<template>
  <div class="container">
    <h1>Vue 3 + Vite SPA</h1>
    <div class="api-status">
      <p v-if="message">{{ message }}</p>
      <p v-else>Click to load API data</p>
    </div>
    <button @click="fetchData">Load from /api/hello</button>
  </div>
</template>