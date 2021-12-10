// Imports
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const path = require('path');
const io = require('socket.io')(server, {
  cors: {
    origin: "*"
  }
});
const game = require('./game.js');

// Express static files
let options = {
  dotfiles: "ignore",
  etag: true,
  extensions: ["html"],
  index: false,
  maxAge: "7d",
  redirect: false
}
app.use(express.static(path.join(__dirname, 'public'), options));

// Routes
app.get('', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

// Socket IO
io.on('connection', socket => {
  console.log("User connected: " + socket.id);

  // Is fired when a user submit their word
  socket.on('userInput', (user_input) => {
    let word_validation = game.existing_word(user_input);

    if (word_validation) {
      // Fire the validWord event
      io.emit('validWord', user_input);
    } else {
      // Fire the invalidWord event
      io.emit('invalidWord', user_input);
    }
  })
});


// NodeJS server
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})