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

const { randomWord, wordValidation } = require('./src/js/game');
let { previous_words } = require('./src/js/game');
const { createPlayer, removePlayer, getPlayersInRoom, getActivePlayersInRoom } = require('./src/js/players');
const { createRoom, deleteRoom } = require('./src/js/rooms');
let { rooms } = require('./src/js/rooms');

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

  // Is fired when a user creates a new room
  socket.on('newRoom_newPlayer', (player_name, room, expected_nb_players) => {

    // Call on player creation & have the player join the newly created room
    const player = createPlayer(socket.id, player_name, 0, room, true);
    socket.join(room);

    // Add a 'rooms' property to the server, for later use
    createRoom(room, expected_nb_players);
    io.rooms = rooms;

    // Send a waiting message to the room
    io.to(room).emit('waitingForMorePlayers');

    // Send players list update for display to the newly created room
    let players_in_room = getPlayersInRoom(room);
    io.to(room).emit('playersList', players_in_room);
  })

  // Is fired when a user joins an existing room
  socket.on('existingRoom_newPlayer', (player_name, room) => {

    // Call on player creation
    const player = createPlayer(socket.id, player_name, 0, room, true);
    socket.join(room);

    // Get the players data for those present in the room
    let players_in_room = getPlayersInRoom(room);

    // Get the room data
    let room_data = io.rooms.find(i => i.name == room);

    // Check if the required number of players has yet joined the room
    if (players_in_room.length < room_data.nb_players) {
      io.to(player.id).emit('waitingForMorePlayers');
    }

    // Send players list update for display to all clients in the room
    io.to(room).emit('playersList', players_in_room);

    // Start the game if the required nb of players has joined the same room:
    // Pick a random word to start with 
    // Send gameStart event to all players in the room
    // Activate the turns system after 4s (time of gameStart countdown)
    if (players_in_room.length == room_data.nb_players) {
      const first_word = randomWord();
      io.to(room).emit('gameStart', first_word);
      setTimeout(() => {
        nextTurn(room)
      }, 4000)
    }
  })

  // Is fired when a user submit a word
  socket.on('userInput', (player_id, user_input, room) => {
    // Call on word validation
    let word_validation = wordValidation(user_input);

    // Check who are the players in the room
    let players_in_room = getPlayersInRoom(room);

    // Check who are the active players in the room
    let active_players = getActivePlayersInRoom(room);

    // If the inputted word is invalid, remove the faulty player from the active_players array
    if (word_validation === 'Invalid word 😞' || word_validation === 'Word already used 😞' || word_validation === 'Nop, not chained 😞') {
      removePlayer(player_id);
      // Send the gameOver event to the faulty player
      io.to(player_id).emit('gameOver', word_validation);
      // Update players list for all players in the room
      const players_in_room = getPlayersInRoom(room);
      io.to(room).emit('playersList', players_in_room);
      lastPlayer(active_players, room);
    } else {
      // If the word is valid, increment the score of the player & update the display
      let player = active_players.find(i => i.id == player_id);
      player.score += 1;
      io.to(room).emit('playersList', players_in_room);

      // Send the word to all clients in the room
      io.to(room).emit('validWord', word_validation);
      if (previous_words.length > 1) {
        // Show the previously used words if there are more than 1 word used to all clients in the room
        io.to(room).emit('previousWords', previous_words);
      }
    }

    // Emit the next turn event to the player 
    if (active_players[turn].id == socket.id) {
      clearTimeout(time_out);
      nextTurn(room);
    }
  })

  // Is fired when a player forfeit
  socket.on('forfeit', (player_id, room) => {
    removePlayer(player_id);
    const players_in_room = getPlayersInRoom(room);
    io.to(room).emit('playersList', players_in_room);
    let active_players = getActivePlayersInRoom(room);
    lastPlayer(active_players, room);
  })
})


/* 

  *_____ TURNS LOGIC _____*
  
*/

let current_turn = 0;
let turn = 0;
let time_out;
const MAX_WAITING = 5000;


function nextTurn(room) {
  let active_players = getActivePlayersInRoom(room);
  turn = current_turn++ % active_players.length;
  //console.log(`CURRENT TURN: ${current_turn}`);
  let current_player = active_players[turn].id;

  io.to(current_player).emit('yourTurn');
  io.to(room).except(current_player).emit('endOfTurn');
  io.to(room).emit('whoseTurnItIs', current_player);

  triggerTimeOut(room);
}

function triggerTimeOut(room) {
  time_out = setTimeout(() => {
    getPlayersInRoom(room);
    nextTurn(room);
  }, MAX_WAITING);
}


/*

  *_____ GAME FUNCTIONS _____*

*/

// Check if there's only one player left, making them the winner 🏆
function lastPlayer(active_players, room) {
  if (active_players.length == 1) {
    io.to(active_players[0].id).emit('winner');
    deleteRoom(room);
  }
}


/*

  *_____ NODE SERVER _____*

*/

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})