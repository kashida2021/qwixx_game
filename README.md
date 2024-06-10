# qwixx_game
Qwixx online board game using socket.io.

Status: **IN DEVELOPMENT**

## Table of Contents
- [Description](#description)
- [Tech Stack](#tech-stack)
- [Aim](#aim)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [More Info](#more-info)

## Description:

This project was created by [kashida2021](https://github.com/kashida2021) (Ken)  and [kawrou](https://github.com/kawrou) (Alan). 
The goal is to recreate the dice/board game [Qwixx](https://boardgamegeek.com/boardgame/131260/qwixx) as a full stack app. 
While there are already projects created by other users for the game, they appear to only implement the score card and are intended to replace the paper card when playing IRL with other people. 
What we are trying to achieve is to allow people to play online through websockets. This would require both a frontend to handle the UI and a backend to handle communication between players and the business logic for the game. 

## Tech Stack:
- React (built with vite)
- TypeScript
- Express
- Node.js
- Socket.io
- Vitest
- react-testing-library
- jest

## Aim:
As well as brining the project to life, we also have some learning outcomes we wanted to achieve:

- Learn how to setup a project from scratch (choosing what frameworks and libraries to use and getting it all to work together).
- Learn about TypeScript and how to work with it.
- Learn about websockets and event-driven-architecture.
- Learn more about classes, OOP and SOLID principles and design patterns. 

## Features:
- Users can choose to create a lobby or join a lobby using a lobby ID. 
- A max of 5 users can join a lobby.
- A user can only join one lobby.
- Once the game starts, all users' game cards are rendered and are visible to everyone. 
- Players' moves are sent live over websockets.
- When the game ends, users are sent back to the lobby where they can choose to leave or play again. 

---
## NOTE: While you can follow the below steps to install and run, please remember that the app is still in development and some features are not yet finished. 
---

## Installation:
To set up the project locally:

Clone the repository:
```bash
git clone https://github.com/kashida2021/qwixx_game.git
```
Navigate to the client directory:
```bash
cd client
```
Install dependencies:
```bash
npm install
```

Navigate to the server directory:
```bash
cd server
```
or if you're in the client directory from previous step:
```
cd ../server
```

Install dependencies:
```bash
npm install
```

Run the development server in both the client and server directory (You'll need to have 2 terminals opened):
```bash
cd client
npm run dev

cd server
npm run dev
```

## Usage:
Once the project is set up and running, you can access the app at http://localhost:5173. 
You'll need to open atleast 2 windows to simulate multiple users. 
Create a lobby on one window and join it on the other using the generated lobby ID to start playing.

## More info:
Stay tuned for more updates as we continue to develop the project.
