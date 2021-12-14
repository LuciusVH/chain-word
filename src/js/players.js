const players = [];

// Create player
function createPlayer(id, name, score, room) {
  const player = { id, name, score, room };
  players.push(player);
  return player;
}


// Update players list
function updatePlayersList(players) {
  console.log('EVENT CALLED'); // Not called
  const players_list = document.getElementById('players_list');
  console.log(players_list);
  players_list.innerHTML = players.map(player => `<li>${player.name} - ${player.score}</li>`).join('');
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
  createPlayer,
  updatePlayersList,
  getRoomPlayers,
  getCurrentPlayer
}