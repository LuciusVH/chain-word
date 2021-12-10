const { connect, model, Schema } = require('mongoose');
const { config } = require('dotenv');

// Connect to the database
function dbConnect() {
  config();

  connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log('Connection established with MongoBD'))
    .catch((err) => console.log(err))
}

// Create the user schema
const userSchema = new Schema({
  name: String,
  score: Number
})
const User = model('user', userSchema);

// Create the words schema
const wordsSchema = new Schema({
  curent_word: String,
  previous_words: [
    { word: String }
  ]
})
const Word = model('word', wordsSchema);

// Create new user
async function createUser(name) {
  const user = new User(name);
  return await user.save()
}

// Exports
module.exports = {
  dbConnect: dbConnect,
  createUser: createUser,
  User,
  Word
}