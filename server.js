// Imports
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*"
  }
});

// Express static files
let options = {
  dotfiles: "ignore",
  etag: true,
  extensions: ["html"],
  index: false,
  maxAge: "7d",
  redirect: false
}
app.use(express.static('public', options))
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/', express.static(__dirname));

// Routes
app.get('', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

// Socket IO
io.on('connection', socket => {
  console.log("User connected: " + socket.id);
  socket.on('userInput', (user_input) => {
    console.log(user_input);
  })
});

// NodeJS server
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})