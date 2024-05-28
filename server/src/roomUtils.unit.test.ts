import { generateUniqueRoomId } from "./roomUtils";

describe("generateUniqueRoomId:", () => {
 it("should generate a unique room id", () => {
  const rooms: string[] = [];
  
  const recursions = 9000;

  for (let i = 0; i < recursions; i++) {
   const newRoom = generateUniqueRoomId(rooms);
   expect(rooms.includes(newRoom)).toBe(false);
   rooms.push(newRoom);
  }
 });
});
