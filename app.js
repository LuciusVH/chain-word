/*

 *_____ CONFIGURATION _____*

*/

// Imports
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const path = require('path');
const io = require('socket.io')(server, {
  cors: {
    origin: "*"
  }
})

const { wordValidation, previous_words } = require('./src/js/game');
const { players, createPlayer, getCurrentPlayer, getPlayersInRoom } = require('./src/js/players');

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

// Route
app.get('', function(req, res) {
  res.render('index');
})


/*

 *_____ SOCKET IO _____*

*/

io.on('connection', socket => {
  console.log(socket.id);

  // Is fired when a user submit their name
  socket.on('newPlayer', (player_name, room_name) => {

    // Call on player creation
    const player = createPlayer(socket.id, player_name, 0, room_name);
    socket.join(player.room_name);

    // Send players list update for display to all clients in the room
    io.to(player.room_name).emit('playersList', players);

    // Start the game if 2 players have joined the same room
    let players_in_room = getPlayersInRoom(room_name)
    if (players_in_room.length == 2) {
      io.to(player.room_name).emit('gameStart', players_in_room);
    }
  })

  // Is fired when a user submit a word
  socket.on('userInput', (user_input) => {
    // Call on word validation
    let word_validation = wordValidation(user_input);
    if (players) {
      let player = getCurrentPlayer(socket.id);
    }

    // Send the word & its validation to all clients in the room
    io.to(player.room_name).emit('wordValidation', word_validation);
    if (previous_words.length > 1) {
      // Show the previously used words if there are more than 1 word used to all clients in the room
      io.to(player.room_name).emit('previousWords', previous_words);
    }
  })
})


/*

 *_____ NODE SERVER _____*

*/

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})