const express = require('./node_modules/express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Node.js Express API!' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});