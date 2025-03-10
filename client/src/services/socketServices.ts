import { io, Socket } from "socket.io-client";

const BACKEND_URL = import.meta.env.BACKEND_URL;

// // To make this more advanced, think about promises and errors
// // let instance;

//  // The more safe way with error handling:
//  //  public connect(url: string): Promise<void> {
//  //     return new Promise((resolve, reject) => {
//  //       this.socket = io(url);
//  //       this.socket.on('connect', () => {
//  //         console.log("Client - connected successfully");
//  //         resolve();
//  //       });
//  //       this.socket.on('connect_error', (err) => {
//  //         console.error("Connection error:", err);
//  //         reject(err);
//  //       });
//  //     });
//  //   }

const developmentURL = "http://localhost:3001";

const URL =
  process.env.NODE_ENV === "production" ? BACKEND_URL : developmentURL;

export const socket: Socket = URL ? io(URL) : io();
