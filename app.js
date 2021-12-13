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
});
const game = require('./src/js/game');
const { players, createPlayer2, getRoomPlayers } = require('./src/js/players');

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
});
app.post('/game', (req, res) => {
  res.render('game');
});

// Socket IO
io.on('connection', socket => {

  // Is fired when a user submit their name
  socket.on('newPlayer', (player_name, room) => {
    // Call on player creation
    const player = createPlayer2(socket.id, player_name, 0, room);
    socket.join(player.room);
    console.log(players);

    // Send players list update for display on client
    io.to(player.room).emit('playersList', {
      players: getRoomPlayers(player.room)
    });
  })

  // Is fired when a user submit their word
  socket.on('userInput', (user_input) => {
    let word_validation = game.existingWord(user_input);
    io.emit('wordValidation', user_input, word_validation)
  });
});


// NodeJS server
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})