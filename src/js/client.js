const { displayWords, gameOver } = require("./game");
const { updatePlayersList } = require("./players");
const { gsap } = require("gsap/dist/gsap");


const socket = io();
const input_form = document.querySelector('#userInput');

// Target the forms and place an event listener on each form submission
const forms = document.querySelectorAll('.form');
const form_join = document.querySelector('#join');
const form_game = document.querySelector('#game');
const word = document.querySelector('#word');
forms.forEach(form => {
  form.addEventListener('submit', (event) => {

    // Target the input value & send it to the server, clear the input field
    if (form.id == 'join') {
      event.preventDefault();
      const player_name = event.target.newPlayer.value;
      socket.emit('newPlayer', player_name);
      // Switch the join form to the game form & change wording displayed
      const tl = gsap.timeline();
      tl.to(form_join, { duration: 0.5, opacity: 0, display: 'none', onStart: wordFadingOut, onComplete: wordChange });

      function wordFadingOut() {
        gsap.to(word, { duration: 0.5, opacity: 0 })
      }

      function wordChange() {
        word.innerText = 'waiting for another player';
      }
      tl.to(form_game, { display: 'block', onStart: wordFadingIn });

      function wordFadingIn() {
        gsap.to(word, { duration: 0.5, opacity: 1 })
      }

      tl.to(form_game, { duration: 0.5, opacity: 1 });

    } else if (form.id == 'game') {
      event.preventDefault();
      const user_input = event.target.userInput.value;
      socket.emit('userInput', user_input);
      form.reset();
      input_form.setAttribute('disabled', true);
    }
  })
})


// Forfeit button linked to the gameOver function
const forfeitBtn = document.querySelector('#forfeit');
if (forfeitBtn) {
  forfeitBtn.addEventListener('click', () => {
    // Game over
    gameOver();
  })
}


// Display & update players list
socket.on('playersList', (players) => {
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