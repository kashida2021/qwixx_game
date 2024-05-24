import { io, Socket } from "socket.io-client";

// To make this more advanced, think about promises and errors

class SocketService {
 private socket: Socket | null = null;

// The more safe way with error handling: 
//  public connect(url: string): Promise<void> {
//     return new Promise((resolve, reject) => {
//       this.socket = io(url);
//       this.socket.on('connect', () => {
//         console.log("Client - connected successfully");
//         resolve();
//       });
//       this.socket.on('connect_error', (err) => {
//         console.error("Connection error:", err);
//         reject(err);
//       });
//     });
//   }

 public connect(url: string): void {
  this.socket = io(url);
  console.log("Client - connected successfully")
//   console.log(this.socket)
 }

 public getSocket(): Socket | null {
  return this.socket;
 }
 public on(event: string, callback: (data: any) => void): void {
  if (this.socket) {
   this.socket.on(event, callback);
   console.log(`On: ${event}`)
  }
 }

 public emit(event: string, data?: any): void {
  if (this.socket) {
   this.socket.emit(event, data);
   console.log(`Emitted: ${event}`)
  }
 }
}

const socketService = new SocketService();
export default socketService;


