import DiceContainer from "../../../src/components/Dice/DiceContainer";
import { vi, describe, test, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import React from "react";
import { Socket } from "socket.io-client";
import { socket } from "../../../src/services/socketServices";

type SocketServiceModule = {
  socket: Socket;
};

vi.mock(
  "../../../src/services/socketServices",
  async (importOriginal: () => Promise<SocketServiceModule>) => {
    const actual = await importOriginal();
    return {
      ...actual,
      socket: {
        ...actual.socket,
        emit: vi.fn(),
      },
    };
  }
);

const user = userEvent.setup();

const diceState = {
  white1: 1,
  white2: 1,
  red: 1,
  yellow: 1,
  green: 1,
  blue: 1,
};

const mockGameState = {
  players: {
    testUser1: {
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
      penalties: 0,
    },
    testUser2: {
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
      penalties: 0,
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
  activePlayer: "testUser1"
};

const mockUserId = "testUser1"

describe("DiceContainer test", () => {
  test("It renders the dice with correct number of pips", () => {
    render(
      <DiceContainer diceState={diceState} lobbyId="1234" socket={socket} gameState={mockGameState} userId={mockUserId} />
    );
    const whiteDice1 = screen.getByLabelText("white1 die");
    const whiteDice2 = screen.getByLabelText("white2 die");
    const redDice = screen.getByLabelText("red die");
    const yellowDice = screen.getByLabelText("yellow die");
    const greenDice = screen.getByLabelText("green die");
    const blueDice = screen.getByLabelText("blue die");

    const white1Pips = within(whiteDice1).getAllByLabelText("die pip");
    const white2Pips = within(whiteDice2).getAllByLabelText("die pip");
    const redPips = within(redDice).getAllByLabelText("die pip");
    const yellowPips = within(yellowDice).getAllByLabelText("die pip");
    const greenPips = within(greenDice).getAllByLabelText("die pip");
    const bluePips = within(blueDice).getAllByLabelText("die pip");
    
    expect(white1Pips).toHaveLength(1);
    expect(white2Pips).toHaveLength(1);
    expect(redPips).toHaveLength(1);
    expect(yellowPips).toHaveLength(1);
    expect(greenPips).toHaveLength(1);
    expect(bluePips).toHaveLength(1);
  });

  test("When roll dice is clicked, it calls the socket event", async () => {
    render(
      <DiceContainer diceState={diceState} lobbyId="1234" socket={socket} gameState={mockGameState} userId={mockUserId}/>
    );
    const rollDiceBtn = screen.getByRole("button", { name: "Roll Dice" });
    await user.click(rollDiceBtn);

    expect(socket.emit).toHaveBeenCalledOnce();
    expect(socket.emit).toHaveBeenCalledWith("roll_dice", { lobbyId: "1234" });
  });
});
