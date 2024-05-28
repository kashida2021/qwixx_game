export const generateUniqueRoomId = (rooms: string[]): string => {
 let room: string;
 do {
  room = Math.floor(1000 + Math.random() * 9000).toString();
 } while (rooms.includes(room));
 return room;
};
