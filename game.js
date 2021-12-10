/* GAME LOGIC */

// Check if the word exists in the English dictionary
function existingWord(user_input) {
  const fs = require('fs');
  const wordListPath = require('word-list');
  const wordsArray = fs.readFileSync(wordListPath, 'utf8').split('\n');
  return wordsArray.includes(user_input);
}

module.exports = {
  existing_word: existingWord,
}