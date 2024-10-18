import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
//import { userEvent } from "@testing-library/user-event";
import React from "react";
import GamePage from "../../../src/pages/GamePage/GamePage";
import "@testing-library/jest-dom";
// import { MemoryRouter } from "react-router-dom";
import { socket } from "../../../src/services/socketServices";
//const user = userEvent.setup();

const lobbyIdMock = "1234";
const membersArrayMock = ["testUser1", "testUser2", "testUser3"];
const mockAvailableMoves = {testUser1: true, testUser2: true, testUser3: true}
const gameState = {
  players: {
    testUser1: {
      gamecard: {
        rows: {
          red: [],
          yellow: [],
          green: [],
          blue: [],
        },
        isLocked: {
          red: false,
          yellow: false,
          green: false,
          blue: false,
        },
        penalties: [],
      },
      hasSubmittedChoice: false,
    },
    testUser2: {
      gamecard: {
        rows: {
          red: [],
          yellow: [],
          green: [],
          blue: [],
        },
        isLocked: {
          red: false,
          yellow: false,
          green: false,
          blue: false,
        },
        penalties: [],
      },
      hasSubmittedChoice: false,
    },
    testUser3: {
      gamecard: {
        rows: {
          red: [],
          yellow: [],
          green: [],
          blue: [],
        },
        isLocked: {
          red: false,
          yellow: false,
          green: false,
          blue: false,
        },
        penalties: [],
      },
      hasSubmittedChoice: false, 
    },
  },
  dice:{
    white1: 1,
    white2: 2,
    red: 3,
    yellow: 4,
    green: 5,
    blue: 6,
  },
  activePlayer: "testUser1",
  hasRolled: false,
};

describe("Game Page Unit Test:", () => {
  it("renders the page", () => {
    render(
      <GamePage
        socket={socket}
        userId={"testUser1"}
        members={membersArrayMock}
        lobbyId={lobbyIdMock}
        gameState={gameState}
        availableMoves={mockAvailableMoves}
      />
    );

    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(`Lobby: ${lobbyIdMock}`);

    const user1 = screen.getByText("testUser1");
    const user2 = screen.getByText("testUser2");
    const user3 = screen.getByText("testUser3"); 
    expect(user1).toBeVisible();
    expect(user2).toBeVisible();
    expect(user3).toBeVisible(); 

    const opponentZone = screen.getByLabelText("opponent-zone");
    const opponentGameCards = opponentZone.querySelectorAll(".game-card");  
    expect(opponentGameCards.length).toBe(2);

    const playerZone = screen.getByLabelText("player-zone")
    const playerGameCard = playerZone.querySelectorAll(".game-card"); 
    expect(playerGameCard.length).toBe(1); 
  });
});
