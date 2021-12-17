/* 

 *_____ IMPORTS _____*
 
*/

const { gameStart, displayWords, gameOver, winner } = require("./game");
const { updatePlayersList } = require("./players");
const { gsap } = require("gsap/dist/gsap");

const socket = io();


/* 

 *_____ FORMS VALIDATION & DATA SCREENING _____*
 
*/

// Target the forms and place an event listener on each form submission
const forms = document.querySelectorAll('.form');
const form_join = document.querySelector('#join');
const form_game = document.querySelector('#game');
const room_name = document.querySelector('#room_name');
const players_list = document.getElementById('players_list');
const word = document.querySelector('#word');
const input_form = document.querySelector('#user_input');
const submit_btn = document.querySelector('#submit');


forms.forEach(form => {
  form.addEventListener('submit', (event) => {

    // Target the input value & send it to the server, clear the input field
    if (form.id == 'join') {
      event.preventDefault();
      const player_name = event.target.new_player.value;
      const room = event.target.room.value;
      socket.emit('newPlayer', player_name, room);
      // Switch the join form to the game form
      // Show the room's & the player's names
      const tl1 = gsap.timeline();

      tl1.fromTo(
        form_join, { display: 'block' }, { duration: 0.5, opacity: 0, display: 'none' }
      );
      tl1.fromTo(
        form_game, { display: 'none' }, { duration: 0.5, opacity: 1, display: 'block', onStart: wordsFadingIn }
      );

      function wordsFadingIn() {
        room_name.innerText = `Room: ${room}`;
        gsap.to(room_name, { duration: 0.5, opacity: 1 })
        gsap.to(players_list, { duration: 0.5, opacity: 1 })
        gsap.to(word, { duration: 0.5, opacity: 1 })
      }

      // Display a waiting message for the 1st player to join the room
      socket.on('waitingForMorePlayers', () => {
        const tl2 = gsap.timeline();
        tl2.fromTo(
          word, { opacity: 1 }, { duration: 0.5, opacity: 0, onComplete: wordChange }
        );

        function wordChange() {
          word.innerText = 'waiting for another player';
        }
        tl2.fromTo(
          word, { opacity: 0 }, { duration: 0.5, opacity: 1 }
        );
      })

    } else if (form.id == 'game') {
      event.preventDefault();
      const room = document.querySelector('#room_name').innerText.substring(6);
      const user_input = event.target.user_input.value;
      socket.emit('userInput', socket.id, user_input, room);
      form.reset();
      disableInput();
    }
  })
})


// Disabled the input field & submit button
function disableInput() {
  submit_btn.setAttribute('disabled', true);
  input_form.setAttribute('disabled', true);
  input_form.removeAttribute('placeholder');
}


// Enable the input field & submit button
function enableInput() {
  submit_btn.removeAttribute('disabled');
  input_form.removeAttribute('disabled');
  input_form.setAttribute('placeholder', 'Think quick & enter your word!');
}


// Forfeit button linked to the gameOver function
const forfeitBtn = document.querySelector('#forfeit');
if (forfeitBtn) {
  forfeitBtn.addEventListener('click', () => {
    gameOver();
  })
}


// Display & update players list
socket.on('playersList', (players_in_room) => {
  updatePlayersList(players_in_room);
})


// Starts the game: 
// Display a countdown and 
// Display the 1st word, randomly picked by the system 
socket.on('gameStart', (first_word) => {
  gameStart(first_word);
})


// Enable the input field & submit button & highlight the name for the player whose turn it is
socket.on('yourTurn', () => {
  enableInput();
  const all_players = Array.from(document.querySelectorAll('#players_list>li'));
  for (let li of all_players) {
    li.classList.remove('current-player');
  }
  const actual_player = document.querySelector(`#${socket.id}`);
  actual_player.classList.add('current-player');
})


// Disable the input field & submit button & highlight the player whose turn it is for the other players
socket.on('endOfTurn', (actual_player_id) => {
  disableInput();
  const all_players = Array.from(document.querySelectorAll('#players_list>li'));
  for (let li of all_players) {
    li.classList.remove('current-player');
  }
  const actual_player = document.querySelector(`#${actual_player_id}`);
  actual_player.classList.add('current-player');
})


//// Highlight the player's name whose turn it is
//socket.on('highlistPlayersTurn', (player_id) => {
//  const actual_player = document.querySelector(`#${player_id}`);
//})


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


// Call the winner function! 🏆  
socket.on('winner', () => {
  winner();
})