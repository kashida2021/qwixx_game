import { Socket } from "socket.io";

//Uses a simple do/while loop to check the generated random id is unique
//If there are too many rooms, I wonder if it'll take too long and
//if there is some algorithm that would help with that
export const generateUniqueRoomId = (rooms: string[]): string => {
    console.log("generateUniqueRoomId was called")
 let room: string;
 do {
  room = Math.floor(1000 + Math.random() * 9000).toString();
 } while (rooms.includes(room));
 return room;
};

export const removeSocketFromRooms = (socket:Socket): void => {
    console.log("removeSocketFromRooms was called")
    let socketRoomsArray = Array.from(socket.rooms); 
    if(socketRoomsArray.length > 1){
        for(let i = 1; i < socketRoomsArray.length; i++){
            socket.leave(socketRoomsArray[i]); 
        }
    }
}