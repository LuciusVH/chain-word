let players = [];
let active_players = []

// Create player
function createPlayer(id, name, score, room) {
  const player = { id, name, score, room };
  players.push(player);
  active_players.push(player);
  return player;
}


// Update players list
function updatePlayersList(players) {
  const players_list = document.getElementById('players_list');
  players_list.innerHTML = players.map(player => `<li id="${player.id}">${player.name} - ${player.score}</li>`).join('');
}


// Get players in the same room
function getPlayersInRoom(room) {
  return players.filter(player => player.room === room);
}


// Get ACTIVE players in the same room (players who haven't lost yet)
function getActivePlayersInRoom(room) {
  return active_players.filter(player => player.room === room);
}


/* 

 *_____ EXPORTS _____*
 
*/

module.exports = {
  active_players,
  createPlayer,
  updatePlayersList,
  getPlayersInRoom,
  getActivePlayersInRoom
}