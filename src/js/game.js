/* 

 *_____ WORD VALIDATION LOGIC _____*
 
*/


// Store the validated words in an array
let previous_words = [];

function wordStorage(word) {
  previous_words.push(word);
  console.log(previous_words);
  return previous_words;
}


// Pick a random first word for the game to start
function randomWord() {
  const fs = require('fs');
  const wordListPath = require('word-list');
  const wordsArray = fs.readFileSync(wordListPath, 'utf8').split('\n');
  var random = Math.floor(Math.random() * wordsArray.length);
  let first_word = wordsArray[random];
  wordStorage(first_word);
  return first_word;
}


// Display the previously used words, except the current one
function displayWords(previous_words) {
  const used_words = document.querySelector("#used_words");
  let previous_words_displayed = previous_words.slice(0, [previous_words.length - 1]);
  used_words.innerHTML = previous_words_displayed.map(word => `<li>${word}</li>`).join('');
}


// Check if the inputted word is valid by:
function wordValidation(user_input) {
  // Checking if the word exists
  const fs = require('fs');
  const wordListPath = require('word-list');
  const wordsArray = fs.readFileSync(wordListPath, 'utf8').split('\n');
  if (!wordsArray.includes(user_input)) return 'Invalid word 😞';
  // Checking if the word hasn't been used already
  else if (previous_words.includes(user_input)) return 'Word already used 😞';
  // Checking if the inputted word is chaining with the previous word
  else if (previous_words.length > 0 && user_input.substring(0, 1) != previous_words.slice(-1).toString().slice(-1)) return 'Nop, not chained 😞';
  // Otherwise it's all good :)
  else {
    wordStorage(user_input);
    return user_input;
  }
}


/* 

 *_____ GAME START & OVER & WINNER _____*
 
*/

function gameStart(first_word) {
  // Display a countdown before the game actually starts
  const { gsap } = require("gsap/dist/gsap");
  const tl = gsap.timeline();
  const word = document.querySelector('#word');
  let countDown = 3;
  word.innerHTML = countDown;

  tl.fromTo(
    word, { scale: 3, opacity: 1 }, { duration: 1, scale: 1, opacity: 0, repeat: countDown, onRepeat: updateNum }
  );
  tl.fromTo(
    word, { opacity: 0 }, { duration: 0.25, opacity: 1, onStart: wording }
  );

  function updateNum() {
    word.innerHTML = --countDown;
    if (countDown == 0) {
      word.innerHTML = 'go!';
    }
  }

  function wording() {
    word.innerText = first_word;
  }
}

const Swal = require('sweetalert2');

function gameOver() {
  Swal.fire({
    title: 'Game over',
    text: 'Wanna replay?',
    icon: 'error',
    confirmButtonText: 'Yes sir!',
    confirmButtonColor: 'hsl(33, 90%, 55%)',
    allowOutsideClick: false,
    showCancelButton: true,
    cancelButtonText: "I'm good, ciao!",
    cancelButtonColor: 'hsl(208, 8%, 47%)',
    allowEscapeKey: false
  }).then((result) => {
    if (result.isConfirmed) {
      socket.emit('replay');
      // replay event to be coded
    }
  })
}


function winner() {
  Swal.fire({
    title: 'Winner winner baby',
    text: 'Congrats!',
    iconHtml: '<img style="max-width: 250%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);" src="https://i.pinimg.com/originals/87/6f/ab/876fab6207f93c293ae77a70f188c402.gif">',
    confirmButtonText: 'Replay',
    confirmButtonColor: 'hsl(33, 90%, 55%)',
    showCancelButton: true,
    cancelButtonText: "Nah, I keep the win",
    cancelButtonColor: 'hsl(208, 8%, 47%)',
    allowOutsideClick: false,
    allowEscapeKey: false
  })
}

/* 

 *_____ EXPORTS _____*
 
*/

module.exports = {
  randomWord,
  wordValidation,
  previous_words,
  displayWords,
  gameStart,
  gameOver,
  winner
}