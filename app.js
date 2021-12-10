// Imports
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const path = require('path');
const io = require('socket.io')(server, {
  cors: {
    origin: "*"
  }
});
const game = require('./src/js/game');
const { dbConnect, createUser } = require('./src/js/db');

// Express static files
let options = {
  dotfiles: "ignore",
  etag: true,
  extensions: ["html"],
  index: false,
  maxAge: "7d",
  redirect: false
}
app.use(express.static(path.join(__dirname, 'dist'), options));

// EJS engine
app.set('view engine', 'ejs');
app.set('views', './dist/views');

app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('', function(req, res) {
  res.render('index');
});
app.post('/game', (req, res) => {
  // Create a new user in the DB
  const name = req.body.newUser;
  const user_creation = createUser({ name });
  user_creation.then(user => {
    if (user._id) res.render('game', { name: user.name })
  }).catch(err => {
    console.log(err);
  })
});

// Socket IO
io.on('connection', socket => {
  console.log("User connected: " + socket.id);
  // Connect to MongoDB
  dbConnect();

  // Is fired when a user submit their name
  socket.on('newUser', (user_input) => {})

  // Is fired when a user submit their word
  socket.on('userInput', (user_input) => {
    let word_validation = game.existing_word(user_input);

    io.emit('wordValidation', user_input, word_validation)
  });
});


// NodeJS server
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})