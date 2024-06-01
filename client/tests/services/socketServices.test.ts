import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { socket } from "../../src/services/socketServices";
import { io } from "socket.io-client";

vi.mock("socket.io-client", () => {
 return {
  io: vi.fn(() => ({
   connect: vi.fn(),
   on: vi.fn(),
   emit: vi.fn(),
  })),
 };
});

describe("SocketService", () => {
 beforeEach(() => {
  socket.connect
 });

 afterEach(() => {
  vi.resetAllMocks();
 });

 it("should connect to the socket server", () => {
  expect(io).toHaveBeenCalledWith("http://localhost:3001");
 });
});
