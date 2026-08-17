<script defer>
  fetch('/api/hello').then(res => res.json()).then(data => {
    document.getElementById('message').textContent = data.message
  })
</script>

<script>
  document.getElementById('loadApiBtn').addEventListener('click', async () => {
    const res = await fetch('/api/hello')
    const data = await res.json()
    document.getElementById('message').textContent = data.message
  })
</script>

<style>
  .btn-primary {
    @apply bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-100 transition-colors;
  }
  
  .api-status {
    @apply mt-4 p-4 bg-gray-50 rounded border-l-4 border-blue-500;
  }
</style>