const { connect, Schema } = require('mongoose');
const { config } = require('dotenv');

function dbConnect() {
  config();

  connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log('Connection established with MongoBD'))
    .catch((err) => console.log(err))
}

const userSchema = new Schema({
  name: String,
  score: Number
})

const wordsSchema = new Schema({
  curent_word: String,
  previous_words: [
    { word: String }
  ]
})

module.exports = {
  dbConnect: dbConnect,
  userSchema: userSchema,
  wordsSchema: wordsSchema
}