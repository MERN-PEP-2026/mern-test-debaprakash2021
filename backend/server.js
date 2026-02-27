import express from 'express';
import http from 'http';
const app = express();

const server =http.createServer(app);
app.get('/', (req, res) => {
  res.send('Hello, World!');
});


server.listen(5019, () => {
  console.log(`Server is running on port 5019`);
});