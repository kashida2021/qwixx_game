import { io, Socket } from "socket.io-client";

// To make this more advanced, think about promises and errors

class SocketService {
 private socket: Socket | null = null;

 public connect(url: string): void {
  this.socket = io(url);
 }

 public getSocket(): Socket | null {
  return this.socket;
 }
 public on(event: string, callback: (data: any) => void): void {
  if (this.socket) {
   this.socket.on(event, callback);
  }
 }

 public emit(event: string, data?: any): void {
  if (this.socket) {
   this.socket.emit(event, data);
  }
 }
}

const socketService = new SocketService();
export default socketService;
