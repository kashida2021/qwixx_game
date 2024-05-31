//Uses a simple do/while loop to check the generated random id is unique
//If there are too many rooms, I wonder if it'll take too long and
//if there is some algorithm that would help with that
export const generateUniqueRoomId = (rooms: string[]): string => {
 let room: string;
 do {
  room = Math.floor(1000 + Math.random() * 9000).toString();
 } while (rooms.includes(room));
 return room;
};

