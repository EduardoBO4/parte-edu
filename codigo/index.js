const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./db/db.json');

// Middlewares
const middlewares = jsonServer.defaults();
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // or specify your domain
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
server.use(middlewares);

// Serve index.html manually (optional)
server.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Your custom routes or logic can go here

// Mount router AFTER custom middleware
server.use(router);

// Custom 404 handler — should go LAST
server.use((req, res) => {
  res.status(404).json({ error: 'not found' });
});


server.listen(3000, () => {
  console.log(`JSON Server is running em http://localhost:3000`)
})