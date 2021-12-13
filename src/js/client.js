const { previous_words, wordStorage, displayWords } = require("./game");

const socket = io();

// Target the forms and place an event listener on each form submission
const form = document.querySelector('.form');
form.addEventListener('submit', (event) => {

  // Target the input value & send it to the server, clear the input field
  if (form.id == 'join') {
    const player_name = event.target.newPlayer.value;
    const room = event.target.room.value;
    socket.emit('newPlayer', player_name, room);
  } else if (form.id == 'game') {
    event.preventDefault();
    const user_input = event.target.userInput.value;
    socket.emit('userInput', user_input);
    form.reset();
  }
})


// Forfeit button linked to the gameOver function
const forfeitBtn = document.querySelector('#forfeit');
if (forfeitBtn) {
  forfeitBtn.addEventListener('click', () => {
    // Game over
    //gameOver();
  })
}


// Display & update players list
socket.on('playersList', (players) => {
  console.log('PLAYERS LIST EVENT RECEIVED ON CLIENT SIDE');
  const players_list = document.getElementById('players_list');
  players_list.innerHTML = players.map(player => `<li>${player.name} - ${player.score}</li>`).join('');
});


// Display the inputed word on screen
socket.on('wordValidation', (user_input, word_validation) => {
  const word = document.querySelector("#word");
  word.innerText = user_input;
  // If the word is validated:
  // 1. display the word in green
  // 2. store it in the previous_words array
  // 3. display the previous words used if the array contains more than 1
  if (word_validation) {
    word.style.color = 'green';
    wordStorage(user_input);
    console.log(previous_words)
    if (previous_words.length > 1) {
      displayWords()
    }
  } else {
    word.style.color = 'red';
    // Game over
    //gameOver();
  }
})