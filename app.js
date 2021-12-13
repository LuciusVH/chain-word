// Imports
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const path = require('path');
const io = require('socket.io')(server, {
  cors: {
    origin: "*"
  }
})
const { wordValidation, previous_words } = require('./src/js/game');
const { createPlayer2, getRoomPlayers, getCurrentPlayer } = require('./src/js/players');

// Express static files
let options = {
  dotfiles: "ignore",
  etag: true,
  extensions: ["html"],
  index: false,
  maxAge: "7d",
  redirect: false
}
app.use(express.static(path.join(__dirname, 'dist'), options));

// EJS engine
app.set('view engine', 'ejs');
app.set('views', './dist/views');

app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('', function(req, res) {
  res.render('index');
})
app.post('/game', (req, res) => {
  res.render('game');
})

// Socket IO
io.on('connection', socket => {

  // Is fired when a user submit their name
  socket.on('newPlayer', (player_name, room) => {
    // Call on player creation
    const player = createPlayer2(socket.id, player_name, 0, room);
    socket.join(player.room);

    // Send players list update for display to all clients
    io.in(player.room).emit('playersList', {
      players: getRoomPlayers(player.room)
    })
  })

  // Is fired when a user submit a word
  socket.on('userInput', (user_input) => {
    // Call on word validation
    let word_validation = wordValidation(user_input);
    let player = getCurrentPlayer(socket.id);
    console.log(player.room);
    // Send the word & its validation to all clients in the room
    io.in(player.room).emit('wordValidation', word_validation);
    if (previous_words.length > 1) {
      io.emit('previousWords', previous_words);
    }
  })
})


// NodeJS server
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})