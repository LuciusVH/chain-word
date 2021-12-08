const express = require('express');
const app = express();
const server = require('http').createServer(app);
const PORT = process.env.PORT || 3000

let options = {
  dotfiles: "ignore",
  etag: true,
  extensions: ["html"],
  index: false,
  maxAge: "7d",
  redirect: false
}
app.use(express.static('public', options))
app.use('/css', express.static(__dirname + 'public/css'));

app.get('', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})