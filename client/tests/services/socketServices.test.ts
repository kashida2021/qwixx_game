import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import socketService from "../../src/services/socketServices";
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
  socketService.connect("http://localhost:3001");
 });
 //  afterEach(() => {
 //   vi.resetAllMocks();
 //  });

 it("should connect to the socket server", () => {
  const mockUrl = "http://localhost:3001";

  expect(io).toHaveBeenCalledWith(mockUrl);
 });

 it(`should set up an event listening using on`, () => {
  const mockEvent = "testEvent";
  const mockCallback = vi.fn();
  const mockSocket = socketService.getSocket();

  mockSocket?.on(mockEvent, mockCallback);
  expect(mockSocket?.on).toHaveBeenCalledWith(mockEvent, mockCallback);
 });

 it("should set up an 'emit' event", () => {
    const mockEvent = "testEvent"; 
    const mockData = {key: 'value'}; 
    const mockSocket = socketService.getSocket(); 

    mockSocket?.emit(mockEvent, mockData);
    expect(mockSocket?.emit).toHaveBeenCalledWith(mockEvent, mockData); 
 })
 it("should emit when no data is passed", () => {
    const mockEvent = "testEvent";
    const mockSocket = socketService.getSocket(); 

    mockSocket?.emit(mockEvent); 
    expect(mockSocket?.emit).toHaveBeenCalledWith(mockEvent); 
 })
});
