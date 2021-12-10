const socket = io();
socket.on('connection');

// Target the form and place an event listener on the form submission
const game = document.querySelector('#game-wrapper');
game.addEventListener('submit', (event) => {
  event.preventDefault();

  // Target the input value & send it to the server
  const user_input = event.target.userInput.value;
  socket.emit('userInput', user_input);
})

// Display the inputed word on screen
const word = document.querySelector("#word");
socket.on('invalidWord', (user_input) => {
  word.innerText = user_input;
  word.style.color = 'red';
})
socket.on('validWord', (user_input) => {
  word.innerText = user_input;
  word.style.color = 'green';
})