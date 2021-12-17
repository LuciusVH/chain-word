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

const { randomWord, wordValidation, gameOver } = require('./src/js/game');
let { previous_words } = require('./src/js/game');
const { createPlayer, getPlayersInRoom } = require('./src/js/players');
let { game } = require('./src/js/players');

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

  // Is fired when a user submit their name
  socket.on('newPlayer', (player_name, room) => {

    // Call on player creation
    const player = createPlayer(socket.id, player_name, 0, room);
    socket.join(player.room);
    let players_in_room = getPlayersInRoom(room);
    if (players_in_room.length < 2) {
      io.to(player.room).emit('waitingForMorePlayers', players_in_room);
    }

    // Send players list update for display to all clients in the room
    io.to(player.room).emit('playersList', players_in_room);

    // Start the game if 2 players have joined the same room:
    // Empty the previous_words array
    // Pick a random word to start with 
    // Send gameStart event to all players in the room
    // Activate the turns system after 4s (time of gameStart countdown)
    if (players_in_room.length == 2) {
      previous_words = [];
      const first_word = randomWord();
      io.to(player.room).emit('gameStart', first_word, player.room);
      setTimeout(() => {
        nextTurn(player.room)
      }, 4000)
    }
  })

  // Is fired when a user submit a word
  socket.on('userInput', (player_id, user_input, room) => {
    // Call on word validation
    let word_validation = wordValidation(user_input);
    console.log(`PREVIOUS WORDS:`);
    console.log(previous_words);

    // Stop the timer if the inputted word is invalid
    // Remove the faulty player from the game array
    if (word_validation === 'Invalid word 😞' || word_validation === 'Word already used 😞' || word_validation === 'Nop, not chained 😞') {
      const player = game.find(i => i = player_id);
      const player_index = game.indexOf(player);
      game.splice(player_index, 1);
      // Last player staying in the game array is the winner
      if (game.length == 1) {
        io.to(game[0].id).emit('winner');
      }
    }

    // Send the word & its validation to all clients in the room
    io.to(room).emit('wordValidation', word_validation);
    if (previous_words.length > 1) {
      // Show the previously used words if there are more than 1 word used to all clients in the room
      io.to(room).emit('previousWords', previous_words);
    }

    // Emit the next turn event to the player 
    let players_in_room = getPlayersInRoom(room)
    if (players_in_room[turn].id == socket.id) {
      clearTimeout(timeOut);
      nextTurn(room);
    }
  })
})


/* 

 *_____ TURNS LOGIC _____*
 
*/

let current_turn = 0;
let turn = 0;
let timeOut;
const MAX_WAITING = 5000;


function nextTurn(room) {
  let players_in_room = getPlayersInRoom(room);
  turn = current_turn++ % players_in_room.length;
  console.log(`CURRENT TURN: ${current_turn}`)
  io.to(players_in_room[turn].id).emit('yourTurn');
  io.to(room).except(players_in_room[turn].id).emit('endOfTurn', players_in_room[turn].id);
  io.to(room).emit('')
  triggerTimeout(room);
}

function triggerTimeout(room) {
  timeOut = setTimeout(() => {
    getPlayersInRoom(room);
    nextTurn(room);
  }, MAX_WAITING);
}


/*

 *_____ NODE SERVER _____*

*/

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})