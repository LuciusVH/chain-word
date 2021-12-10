const socket = io();
socket.on('connection');

// Target the forms and place an event listener on each form submission
const form = document.querySelector('.form');
form.addEventListener('submit', (event) => {

  // Target the input value & send it to the server, clear the input field
  if (form.id == 'join') {
    const user_input = event.target.newUser.value;
    socket.emit('newUser', user_input);
  } else if (form.id == 'game') {
    event.preventDefault();
    const user_input = event.target.userInput.value;
    socket.emit('userInput', user_input);
    form.reset();
  }
})

// Display the inputed word on screen
const word = document.querySelector("#word");
socket.on('wordValidation', (user_input, word_validation) => {
  if (word_validation) {
    word.innerText = user_input;
    word.style.color = 'green';
  } else {
    // Game over
  }
})