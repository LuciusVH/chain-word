const { displayWords } = require("./game");
const { updatePlayersList } = require("./players");

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
  console.log('EVENT FIRED FROM CLIENT SIDE'); // Not fired
  updatePlayersList(players);
})


// Display the inputed word on screen
socket.on('wordValidation', (word_validation) => {
  const word = document.querySelector("#word");
  word.innerText = word_validation;
  // If the word in invalid, display the error message in red & fire the gameOver function
  if (word_validation === 'Invalid word 😞' || word_validation === 'Word already used 😞' || word_validation === 'Nop, not chained 😞') {
    word.style.color = 'red';
    // Game over
    //gameOver();

    // Otherwise display the word in green
  } else {
    word.style.color = 'green';
  }
})

// Display the list of previously used words
socket.on('previousWords', (previous_words) => {
  displayWords(previous_words);
})