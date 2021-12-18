let rooms = [];

// Create room
function createRoom(room_name, expected_nb_players) {
  const room = { name: room_name, nb_players: parseInt(expected_nb_players) };
  rooms.push(room);
  return rooms;
}


/* 

 *_____ EXPORTS _____*
 
*/

module.exports = {
  createRoom,
  rooms
}