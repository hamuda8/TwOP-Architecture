import { createSignal, onMount } from 'solid-js';

function App() {
  const [message, setMessage] = createSignal('');

  onMount(async () => {
    const res = await fetch('/api/hello');
    const data = await res.json();
    setMessage(data.message);
  });

  return (
    <>
      <h1>SolidJS + Vite SPA</h1>
      <div class="api-status">
        {message() ? <p>{message()}</p> : <p>Click to load API data</p>}
      </div>
      <button onClick={async () => {
        const res = await fetch('/api/hello');
        const data = await res.json();
        setMessage(data.message);
      }}>
        Load from /api/hello
      </button>
    </>
  );
}

export default App;