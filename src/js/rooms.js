let rooms = [];

// Create room to server params
function createRoom(room_name, expected_nb_players) {
  const room = { name: room_name, nb_players: parseInt(expected_nb_players) };
  rooms.push(room);
  return rooms;
}


// Delete room to server params
function deleteRoom(room_name) {
  const room = rooms.find(i => i.name = room_name);
  const room_index = rooms.indexOf(room);
  rooms.splice(room_index, 1);
  return rooms;
}


/* 

 *_____ EXPORTS _____*
 
*/

module.exports = {
  createRoom,
  rooms,
  deleteRoom
}