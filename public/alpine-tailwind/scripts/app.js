// Alpine + Tailwind App Logic
document.addEventListener('alpine:init', () => {
  Alpine.data('apiApp', () => ({
    message: '',
    loadApi: async function() {
      try {
        const res = await fetch('/api/hello')
        const data = await res.json()
        this.message = data.message
      } catch (e) {
        this.message = 'Error loading API'
      }
    }
  }))
})

// Initial fetch on load
document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/hello')
    .then(res => res.json())
    .then(data => {
      const el = document.getElementById('message')
      if (el) el.textContent = data.message
    })
    .catch(() => {
      const el = document.getElementById('message')
      if (el) el.textContent = 'Error loading API'
    })
})