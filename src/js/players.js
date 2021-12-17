let players = [];
let game = []

// Create player
function createPlayer(id, name, score, room) {
  const player = { id, name, score, room };
  players.push(player);
  game.push(player);
  console.log(`GAME ARRAY:`);
  console.log(game);
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


/* 

 *_____ EXPORTS _____*
 
*/

module.exports = {
  game,
  createPlayer,
  updatePlayersList,
  getPlayersInRoom
}