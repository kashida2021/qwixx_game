import { describe, it, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
//import { userEvent } from "@testing-library/user-event";
import React from "react";
import GamePage from "../../../src/pages/GamePage/GamePage";
import "@testing-library/jest-dom";
// import { MemoryRouter } from "react-router-dom";
import { socket } from "../../../src/services/socketServices";
//const user = userEvent.setup();
import { initialGameState, hasRolledGameState, user1HasSubmittedState, gameEndStateLocked } from "./__fixtures__/gameStates";
import { endGameSummaryLockedState } from "./__fixtures__/gameSummaryStates";

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
        gameSummary={undefined}
        isGameEnd={false}
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
    const opponentGameCards = opponentZone.querySelectorAll(".qwixx-card");
    expect(opponentGameCards.length).toBe(2);

    const playerZone = screen.getByLabelText("player-zone")
    const playerGameCard = playerZone.querySelectorAll(".qwixx-card");
    expect(playerGameCard.length).toBe(1);
  });

  test("end turn button should be enabled when dice has been rolled", () => {
    render(
      <GamePage
        socket={socket}
        userId={"testUser1"}
        members={membersArrayMock}
        lobbyId={lobbyIdMock}
        gameState={hasRolledGameState}
        availableMoves={true}
        gameSummary={undefined}
        isGameEnd={false}
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
        gameSummary={undefined}
        isGameEnd={false}
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
        gameSummary={undefined}
        isGameEnd={false}
      />
    );

    const endTurnBtn = screen.getByText("End Turn")
    expect(endTurnBtn).toBeVisible()
    expect(endTurnBtn).toBeDisabled()
  })

  test("passMove button should be disabled if dice has not been rolled", ()=> {
    render(
      <GamePage
        socket={socket}
        userId={"testUser1"}
        members={membersArrayMock}
        lobbyId={lobbyIdMock}
        gameState={initialGameState}
        availableMoves={true}
        gameSummary={undefined}
        isGameEnd={false}
      />
    )
    const passMoveBtn = screen.getByText("Pass Move");
    expect(passMoveBtn).toBeVisible();
    expect(passMoveBtn).toBeDisabled();
  })

  test("passMove btn should be disabled if player has ended turn", ()=> {
    render(
      <GamePage
        socket={socket}
        userId={"testUser1"}
        members={membersArrayMock}
        lobbyId={lobbyIdMock}
        gameState={user1HasSubmittedState}
        availableMoves={false}
        gameSummary={undefined}
        isGameEnd={false}
      />
      )
      const passMoveBtn = screen.getByText("Pass Move");
      expect(passMoveBtn).toBeVisible();
      expect(passMoveBtn).toBeDisabled();
    
  })

  test("passMoveBtn should be disabled if not active player", ()=> {
      render(
        <GamePage
          socket={socket}
          userId={"testUser2"}
          members={membersArrayMock}
          lobbyId={lobbyIdMock}
          gameState={user1HasSubmittedState}
          availableMoves={true}
          gameSummary={undefined}
          isGameEnd={false}
        />
      )

      const passMoveBtn = screen.getByText("Pass Move");
      expect(passMoveBtn).toBeVisible();
      expect(passMoveBtn).toBeDisabled();
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
        gameSummary={undefined}
        isGameEnd={false}
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
        gameSummary={undefined}
        isGameEnd={false}
      />
    );

    const acceptPenaltyBtc = screen.getByText("Accept Penalty");
    expect(acceptPenaltyBtc).toBeVisible()
  })

  test("GameEndModal should render when gameEnd conditions have been met", ()=> {
    render(<GamePage
      socket={socket}
      userId={"testUser1"}
      members={membersArrayMock}
      lobbyId={lobbyIdMock}
      gameState={gameEndStateLocked}
      availableMoves={false}
      isGameEnd={true}
      gameSummary={endGameSummaryLockedState}
    />
    );

    screen.debug();
    console.log("end game locked summary", endGameSummaryLockedState);
    
    const gameEndModal = screen.getByText(/Game End Summary/i);
    expect(gameEndModal).toBeVisible();
    });

  test.todo("When hasSubmited choice is true, confirm button is disabled")
  test.todo("When a player confirms their selected number, that number cell becomes disabled")
});
