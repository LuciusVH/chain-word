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

const forms = document.querySelectorAll('.form');
const creating_btn = document.querySelector('#creating_game');
const joining_btn = document.querySelector('#joining_game');
const form_init = document.querySelector('#init');
const form_create = document.querySelector('#create');
const form_join = document.querySelector('#join');
const create_room_input = document.querySelector('#create_room');
const create_room_btn = document.querySelector('#create>button');
const join_room_input = document.querySelector('#join_room');
const join_room_btn = document.querySelector('#join>button');
const form_game = document.querySelector('#game');
const room_name = document.querySelector('#room_name');
const players_list = document.getElementById('players_list');
const word = document.querySelector('#word');
const input_form = document.querySelector('#user_input');
const submit_btn = document.querySelector('#submit');

// On the init form, targets the buttons to get if the player is creating or joining a game
creating_btn.addEventListener('click', (event) => {
  event.preventDefault();
  const tl = gsap.timeline();
  tl.fromTo(
    form_init, { display: 'block' }, { duration: 0.5, opacity: 0, display: 'none' }
  );
  tl.fromTo(
    form_create, { display: 'none' }, { duration: 0.5, opacity: 1, display: 'block' }
  );
})
joining_btn.addEventListener('click', (event) => {
  event.preventDefault();
  const tl = gsap.timeline();
  tl.fromTo(
    form_init, { display: 'block' }, { duration: 0.5, opacity: 0, display: 'none' }
  );
  tl.fromTo(
    form_join, { display: 'none' }, { duration: 0.5, opacity: 1, display: 'block' }
  );
})


// *_____ SOCKET IO EVENTS _____* //

// ROOM CREATION:
// Listen to user's room input on the join form, to make sure the room entered does not already exists
create_room_input.addEventListener('change', (event) => {
  let room_input = event.target.value;
  socket.emit('createRoomCheck', socket.id, room_input);
})

// Enable the 'Join the room' button if no other room has the same name already
socket.on('createRoomValidated', () => {
  create_room_btn.removeAttribute('disabled');
})

// Alert the user that the inputted room does not exist
socket.on('createRoomInvalidated', () => {
  alert('That room already exist, pick another name 🤷');
})


// ROOM JOINING:
// Listen to user's room input on the join form, to make sure the room entered exists
join_room_input.addEventListener('change', (event) => {
  let room_input = event.target.value;
  socket.emit('joinRoomCheck', socket.id, room_input);
})

// Enable the 'Join the room' button if the room has been found
socket.on('joinRoomValidated', () => {
  join_room_btn.removeAttribute('disabled');
})

// Alert the user that the inputted room does not exist
socket.on('joinRoomInvalidated', () => {
  alert('That room does not exist 🤷');
})

// FORMS VALIDATION & FORMS DISPLAY:
// Target the forms and place an event listener on each form submission
forms.forEach(form => {
  form.addEventListener('submit', (event) => {

    // Target the input value & send it to the server, clear the input field
    if (form.id == 'create') {
      event.preventDefault();
      const player_name = event.target.create_new_player.value;
      const room = event.target.create_room.value.toLowerCase();
      const expected_nb_players = event.target.nb_players.value;
      socket.emit('newRoom_newPlayer', player_name, room, expected_nb_players);
      // Switch the create form to the game form
      // Show the room's & the player's names
      const tl1 = gsap.timeline();

      tl1.fromTo(
        form_create, { display: 'block' }, { duration: 0.5, opacity: 0, display: 'none' }
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
        waiting();
      })

    } else if (form.id == 'join') {
      event.preventDefault();
      const player_name = event.target.join_new_player.value;
      const room = event.target.join_room.value.toLowerCase();
      socket.emit('existingRoom_newPlayer', player_name, room);
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

      // Display a waiting message if the player isn't the last one expected
      socket.on('waitingForMorePlayers', () => {
        waiting();
      })

    } else if (form.id == 'game') {
      event.preventDefault();
      const room = document.querySelector('#room_name').innerText.substring(6);
      const user_input = event.target.user_input.value.toLowerCase();
      socket.emit('userInput', socket.id, user_input, room);
      form.reset();
      disableInput();
    }
  })
})


// Forfeit button linked to the gameOver function
const forfeitBtn = document.querySelector('#forfeit');
if (forfeitBtn) {
  forfeitBtn.addEventListener('click', () => {
    gameOver();
    const room = document.querySelector('#room_name').innerText.substring(6);
    socket.emit('forfeit', socket.id, room);
  })
}


// Display & update players list
socket.on('playersList', (players_in_room) => {
  updatePlayersList(players_in_room);
})


// STARTS THE GAME: 
// Display a countdown
// Display the 1st word, randomly picked by the system 
socket.on('gameStart', (first_word) => {
  gameStart(first_word);
})


// PLAYER'S TURN
socket.on('yourTurn', () => {
  enableInput();
})


// END OF TURN
socket.on('endOfTurn', () => {
  disableInput();
})


// Display whose turn it is
socket.on('whoseTurnItIs', (current_player) => {
  const all_players = Array.from(document.querySelectorAll('#players_list>li'));
  for (let li of all_players) {
    li.classList.remove('current-player');
  }
  const actual_player = document.querySelector(`#${current_player}`);
  actual_player.classList.add('current-player');
})


// Display the inputed word on screen
socket.on('validWord', (word_validation) => {
  word.innerText = word_validation;
  word.style.color = 'green';
})


// Display the list of previously used words
socket.on('previousWords', (previous_words) => {
  displayWords(previous_words);
})


// GAME OVER
socket.on('gameOver', (word_validation) => {
  gameOver(word_validation);
})


// WINNER! 🏆  
socket.on('winner', () => {
  winner();
})


// *_____ FUNCTIONS _____* //

// Display "waiting for more players"
function waiting() {
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
}


// Disabled the input field & submit button
function disableInput() {
  input_form.value = '';
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