/* GAME LOGIC */

// Store the validated words in an array
let previous_words = [];

function wordStorage(user_input) {
  previous_words.push(user_input);
  return previous_words;
}


// Check if the word exists in the English dictionary
function existingWord(user_input) {
  const fs = require('fs');
  const wordListPath = require('word-list');
  const wordsArray = fs.readFileSync(wordListPath, 'utf8').split('\n');
  let word_validation = wordsArray.includes(user_input);
  return word_validation;
}


// Display the previously used words, except the current one
function displayWords() {
  const used_words = document.querySelector("#used_words");
  let previous_words_displayed = previous_words.slice(0, [previous_words.length - 1]);
  used_words.innerHTML = previous_words_displayed.map(word => `<li>${word}</li>`).join('');
}

// Exports
module.exports = {
  existingWord,
  wordStorage,
  previous_words,
  displayWords
}