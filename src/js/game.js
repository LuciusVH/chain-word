/* 

 *_____ TURNS LOGIC _____*
 
*/



/* 

 *_____ WORD VALIDATION LOGIC _____*
 
*/

// Store the validated words in an array
let previous_words = [];

function wordStorage(user_input) {
  previous_words.push(user_input);
  return previous_words;
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

 *_____ GAME OVER _____*
 
*/

const Swal = require('sweetalert2');

function gameOver() {
  Swal.fire({
    title: 'Game over',
    text: 'Wanna replay?',
    icon: 'error',
    confirmButtonText: 'Yes sir!',
    confirmButtonColor: '#F49725',
    allowOutsideClick: false,
    allowEscapeKey: false
  }).then((result) => {
    if (result.isConfirmed) {
      socket.emit('replay');
      // replay event to be coded
    }
  })
}


/* 

 *_____ EXPORTS _____*
 
*/

module.exports = {
  wordValidation,
  previous_words,
  displayWords,
  gameOver
}