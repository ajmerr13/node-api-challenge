const express = require('express');
const projectRouter = require('./routers/projectRouter');
const actionRouter = require('./routers/actionRouter');
const server = express();


server.use(express.json());


server.get('/', (req, res) => {
  res.send(`<h2>Welcome to the Server</h2>`);
});


server.use('/api/projects', projectRouter);
server.use('/api/actions', actionRouter);


module.exports = server; 