const socket = io('http://localhost:3000');
socket.on('connection');

// Target the form and place an event listener on the form submission
const game = document.querySelector('#game-wrapper');
game.addEventListener('submit', (event) => {
  event.preventDefault();

  // Target the input value & send it to the server
  const user_input = event.target.userInput.value;
  socket.emit('userInput', user_input);
})