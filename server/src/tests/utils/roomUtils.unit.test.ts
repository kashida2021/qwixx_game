import { generateUniqueRoomId } from "../../utils/roomUtils";

describe("generateUniqueRoomId:", () => {
 it("should generate a unique room id", () => {
  const rooms: string[] = [];
  
  //Can set a higher recursion. Maybe 9999 is the maximum.
  //The higher the recursion, the slower the test
  const recursions = 1000;

  for (let i = 0; i < recursions; i++) {
   const newRoom = generateUniqueRoomId(rooms);
   expect(rooms.includes(newRoom)).toBe(false);
   rooms.push(newRoom);
  }
 });
});
