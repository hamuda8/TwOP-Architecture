import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => {
        setMessage(data.message);
      });
  }, []);

  const loadApi = () => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message));
  };

  return (
    <div className="container">
      <h1>React + Vite SPA</h1>
      <div className="api-status">
        {message ? <p>{message}</p> : <p>Click to load API data</p>}
      </div>
      <button onClick={loadApi}>Load from /api/hello</button>
    </div>
  );
}

export default App;