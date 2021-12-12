const players = [];

// Create user
function createPlayer2(id, name, score, room) {
  const player = { id, name, score, room };
  players.push(player);
  return player;
}

// Get room players
function getRoomPlayers(room) {
  console.log('GET ROOM PLAYERS FUNCTION CALLED');
  return players.filter(player => player.room === room);
}

// Exports
module.exports = {
  players,
  createPlayer2,
  getRoomPlayers
}