<script setup>
import { ref, onMounted } from 'vue'

onMounted(async () => {
  const { data } = await fetch('/api/hello').then(res => res.json())
  message.value = data.message
})

const message = ref('')
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