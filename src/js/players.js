const players = [];

// Create player
function createPlayer2(id, name, score, room) {
  const player = { id, name, score, room };
  players.push(player);
  return player;
}


// Get room players
function getRoomPlayers(room) {
  return players.filter(player => player.room === room);
}


// Get current player
function getCurrentPlayer(id) {
  return players.find(player => player.id === id);
}


// Exports
module.exports = {
  players,
  createPlayer2,
  getRoomPlayers,
  getCurrentPlayer
}