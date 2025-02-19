// Placeholder for the main source code file. Replace with actual code.
console.log('Hello, Agora Hackathon!');

// Example of a simple HTTP server using Node.js
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, Agora Hackathon!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
