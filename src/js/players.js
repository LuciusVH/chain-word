let players = [];

// Create player
function createPlayer(id, name, score, room, playing) {
  const player = { id: id, name: name, score: score, room: room, playing: playing };
  players.push(player);
  return player;
}


// Switch playing to false when player has given a wrong answer or has forfeited
function removePlayer(id) {
  const player = players.find(i => i.id == id);
  player.playing = false;
  return players;
}


// Update players list
function updatePlayersList(players) {
  const players_list = document.getElementById('players_list');

  players_list.innerHTML = players.map(player => {
    if (player.playing) {
      return `<li id="${player.id}">&nbsp;${player.name}&nbsp; - &nbsp;${player.score}&nbsp;</li>`;
    } else {
      return `<li id="${player.id}" class="not-playing">&nbsp;${player.name}&nbsp; - &nbsp;${player.score}&nbsp;</li>`;
    }
  }).join('');
}


// Get players in the same room
function getPlayersInRoom(room) {
  return players.filter(player => player.room === room);
}


// Get ACTIVE players in the same room (players who haven't lost yet)
function getActivePlayersInRoom(room) {
  return players.filter(player => player.room == room && player.playing == true);
}


/* 

 *_____ EXPORTS _____*
 
*/

module.exports = {
  createPlayer,
  removePlayer,
  updatePlayersList,
  getPlayersInRoom,
  getActivePlayersInRoom
}