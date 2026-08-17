<script setup>
import { useEffect, state } from 'react'

useEffect(() => {
  fetch('/api/hello').then(res => res.json()).then(data => {
    setMessage(data.message)
  })
}, [])

const [message, setMessage] = useState('')

return (
  <div className="container">
    <h1>React + Vite SPA</h1>
    <div className="api-status">
      {message ? <p>{message}</p> : <p>Click to load API data</p>}
    </div>
    <button onClick={() => fetch('/api/hello').then(res => res.json()).then(data => setMessage(data.message))}>Load from /api/hello</button>
  </div>
)