import { describe, it, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
//import { userEvent } from "@testing-library/user-event";
import React from "react";
import GamePage from "../../../src/pages/GamePage/GamePage";
import "@testing-library/jest-dom";
// import { MemoryRouter } from "react-router-dom";
import { socket } from "../../../src/services/socketServices";
//const user = userEvent.setup();
import { initialGameState, hasRolledGameState, user1HasSubmittedState } from "./__fixtures__/gameStates";

const lobbyIdMock = "1234";
const membersArrayMock = ["testUser1", "testUser2", "testUser3"];

describe("Game Page Unit Test:", () => {
  it("renders the page", () => {
    render(
      <GamePage
        socket={socket}
        userId={"testUser1"}
        members={membersArrayMock}
        lobbyId={lobbyIdMock}
        gameState={hasRolledGameState}
        availableMoves={true}
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

  test("end turn button should enabled when dice has been rolled", () => {
    render(
      <GamePage
        socket={socket}
        userId={"testUser1"}
        members={membersArrayMock}
        lobbyId={lobbyIdMock}
        gameState={hasRolledGameState}
        availableMoves={true}
      />
    );

    const endTurnBtn = screen.getByText("End Turn")
    expect(endTurnBtn).toBeVisible()
    expect(endTurnBtn).not.toBeDisabled()
  })

  test("end turn button should be disabled when dice hasn't been rolled", () => {
    render(
      <GamePage
        socket={socket}
        userId={"testUser1"}
        members={membersArrayMock}
        lobbyId={lobbyIdMock}
        gameState={initialGameState}
        availableMoves={true}
      />
    );

    const endTurnBtn = screen.getByText("End Turn")
    expect(endTurnBtn).toBeVisible()
    expect(endTurnBtn).toBeDisabled()
  })

  test("end turn button should be disabled if player has finished their turn", () => {
    render(
      <GamePage
        socket={socket}
        userId={"testUser1"}
        members={membersArrayMock}
        lobbyId={lobbyIdMock}
        gameState={user1HasSubmittedState}
        availableMoves={true}
      />
    );

    const endTurnBtn = screen.getByText("End Turn")
    expect(endTurnBtn).toBeVisible()
    expect(endTurnBtn).toBeDisabled()
  })

  test("confirm button should render if there is an available move", () => {
    render(
      <GamePage
        socket={socket}
        userId={"testUser1"}
        members={membersArrayMock}
        lobbyId={lobbyIdMock}
        gameState={hasRolledGameState}
        availableMoves={true}
      />
    );

    const confirmBtn = screen.getByText("Confirm");
    expect(confirmBtn).toBeVisible()
  })

  test("Accept Penalty button should render if there are no available moves", () => {
    render(
      <GamePage
        socket={socket}
        userId={"testUser1"}
        members={membersArrayMock}
        lobbyId={lobbyIdMock}
        gameState={hasRolledGameState}
        availableMoves={false}
      />
    );

    const acceptPenaltyBtc = screen.getByText("Accept Penalty");
    expect(acceptPenaltyBtc).toBeVisible()
  })

  test.todo("When hasSubmited choice is true, confirm button is disabled")
  test.todo("When a player confirms their selected number, that number cell becomes disabled")
});
