import DiceContainer from "../../../src/components/Dice/DiceContainer";
import { vi, describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
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

describe("DiceContainer test", () => {
  test("It renders the dice with correct numbers", () => {
    render(
      <DiceContainer diceState={diceState} lobbyId="1234" socket={socket} />
    );
    const whiteDice1 = screen.getByLabelText("white1 dice");
    const whiteDice2 = screen.getByLabelText("white2 dice");
    const redDice = screen.getByLabelText("red dice");
    const yellowDice = screen.getByLabelText("yellow dice");
    const greenDice = screen.getByLabelText("green dice");
    const blueDice = screen.getByLabelText("blue dice");

    expect(whiteDice1).toHaveTextContent("1");
    expect(whiteDice2).toHaveTextContent("1");
    expect(redDice).toHaveTextContent("1");
    expect(yellowDice).toHaveTextContent("1");
    expect(greenDice).toHaveTextContent("1");
    expect(blueDice).toHaveTextContent("1");
  });

  test("When roll dice is clicked, it calls the socket event", async () => {
    render(
      <DiceContainer diceState={diceState} lobbyId="1234" socket={socket} />
    );
    const rollDiceBtn = screen.getByRole("button", {name: "Roll Dice"});
    await user.click(rollDiceBtn);

    expect(socket.emit).toHaveBeenCalledOnce();
    expect(socket.emit).toHaveBeenCalledWith("roll_dice", {lobbyId: "1234"})
  });
});
