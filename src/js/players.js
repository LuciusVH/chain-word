let players = [];

// Create player
function createPlayer(id, name, score, room_name) {
  const player = { id, name, score, room_name };
  console.log(player.id)
  players.push(player);
  return player;
}


// Update players list
function updatePlayersList(players) {
  const players_list = document.getElementById('players_list');
  players_list.innerHTML = players.map(player => `<li>${player.name} - ${player.score}</li>`).join('');
}


// Get current player
function getCurrentPlayer(id) {
  return players.find(player => player.id === id);
}


// Get players in the same room
function getPlayersInRoom(room_name) {
  return players.filter(player => player.room_name === room_name);
}


/* 

 *_____ EXPORTS _____*
 
*/

module.exports = {
  players,
  createPlayer,
  updatePlayersList,
  getCurrentPlayer,
  getPlayersInRoom
}