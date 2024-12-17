import { describe, it, expect, test, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import React from "react";
import GameCard from "../../../src/components/GameCard/GameCard";
import "@testing-library/jest-dom";
import { socket } from "../../../src/services/socketServices";
import { Socket } from "socket.io-client";
import { QwixxLogic } from "../../../src/types/qwixxLogic";
import { gameCardBaseState, gameCardManyMarkedNumbersState, gameCardPlayerLockedRowState } from "./__fixtures__/gameCardStates";

const user = userEvent.setup();

//type SocketServiceModule = {
//  socket: Socket;
//};
//
//interface PlayerChoice {
//  row: string;
//  number: number;
//}

//const mockAvailableMoves = { testUser1: true, testUser2: true, testUser3: true }
//const membersArrayMock = ["testUser1", "testUser2", "testUser3"];
//
//let lobbyIdMock: string = "1234";
//let userIdMock: string = "";
//let playerChoiceMock: PlayerChoice | null = null;
//
//vi.mock(
//  "../../../src/services/socketServices",
//  async (importOriginal: () => Promise<SocketServiceModule>) => {
//    const actual = await importOriginal();
//    return {
//      ...actual,
//      socket: {
//        ...actual.socket,
//        emit: vi.fn(() => {
//          lobbyIdMock = "1234",
//            userIdMock = "test_user"
//          playerChoiceMock = { row: "red", number: 2 }
//        }),
//      },
//    };
//  }
//);

const ariaLabelRed = "row-red";
const ariaLabelYellow = "row-yellow";
const ariaLabelBlue = "row-blue";
const ariaLabelGreen = "row-green";
const cssClicked = "qwixx-card__button--clicked";
const cssPenalties = "penalties-list";

const ariaNonInteractiveBtn = "non-interactive-button";

const mockCellClick = vi.fn();

describe("Game Card Test:", () => {
  describe("Opponents Card:", () => {
    it("it renders the GameCard for the opponent", () => {
      render(
        <GameCard
          member={"testUser1"}
          isOpponent={true}
          gameCardData={gameCardBaseState}
          cellClick={mockCellClick}
          handleLockRow={mockCellClick}
        />
      );

      const redRow = screen.getByRole("list", { name: ariaLabelRed });
      const yellowRow = screen.getByRole("list", { name: ariaLabelYellow });
      const blueRow = screen.getByRole("list", { name: ariaLabelBlue });
      const greenRow = screen.getByRole("list", { name: ariaLabelGreen });

      const redRowButtons = within(redRow).getAllByLabelText(ariaNonInteractiveBtn);
      const yellowRowButtons = within(yellowRow).getAllByLabelText(ariaNonInteractiveBtn);
      const blueRowButtons = within(blueRow).getAllByLabelText(ariaNonInteractiveBtn);
      const greenRowButtons = within(greenRow).getAllByLabelText(ariaNonInteractiveBtn);

      const penalties = screen.getByRole("list", { name: cssPenalties });
      const penaltiesCheckBox = within(penalties).getAllByLabelText("fake-checkbox");

      expect(redRow).toBeVisible();
      expect(yellowRow).toBeVisible();
      expect(blueRow).toBeVisible();
      expect(greenRow).toBeVisible();

      expect(redRowButtons).toHaveLength(12);
      expect(yellowRowButtons).toHaveLength(12);
      expect(blueRowButtons).toHaveLength(12);
      expect(greenRowButtons).toHaveLength(12);

      expect(penalties).toBeVisible;
      expect(penaltiesCheckBox).toHaveLength(4);
    });

    it("the numbered cells have the 'clicked' attribute", () => {
      render(
        <GameCard
          member={"testUser1"}
          isOpponent={true}
          gameCardData={gameCardManyMarkedNumbersState}
          cellClick={mockCellClick}
          handleLockRow={mockCellClick}
        />
      );

      const redRow = screen.getByRole("list", { name: ariaLabelRed });
      const yellowRow = screen.getByRole("list", { name: ariaLabelYellow });
      const blueRow = screen.getByRole("list", { name: ariaLabelBlue });
      const greenRow = screen.getByRole("list", { name: ariaLabelGreen });

      const redButtons = within(redRow).getAllByLabelText(ariaNonInteractiveBtn);
      const yellowButtons = within(yellowRow).getAllByLabelText(ariaNonInteractiveBtn);
      const blueButtons = within(blueRow).getAllByLabelText(ariaNonInteractiveBtn);
      const greenButtons = within(greenRow).getAllByLabelText(ariaNonInteractiveBtn);

      redButtons
        .filter((button, index) => index < 4)
        .forEach((button) => expect(button).toHaveClass(cssClicked));

      redButtons
        .filter((button, index) => index > 4)
        .forEach((button) => expect(button).not.toHaveClass(cssClicked));

      expect(yellowButtons[0]).toHaveClass(cssClicked);
      expect(yellowButtons[1]).not.toHaveClass(cssClicked);

      expect(blueButtons[1]).toHaveClass(cssClicked);
      expect(blueButtons[2]).not.toHaveClass(cssClicked);

      expect(greenButtons[1]).toHaveClass(cssClicked);
      expect(greenButtons[2]).not.toHaveClass(cssClicked);
    });
  });

  describe("Player's Card", () => {
    it("it renders the GameCard for the player", () => {
      render(
        <GameCard
          member={"testUser1"}
          isOpponent={false}
          gameCardData={gameCardBaseState}
          cellClick={mockCellClick}
          handleLockRow={mockCellClick}
        />
      );

      const redRow = screen.getByRole("list", { name: ariaLabelRed });
      const yellowRow = screen.getByRole("list", { name: ariaLabelYellow });
      const blueRow = screen.getByRole("list", { name: ariaLabelBlue });
      const greenRow = screen.getByRole("list", { name: ariaLabelGreen });

      const redRowButtons = within(redRow).getAllByRole("button");
      const yellowRowButtons = within(yellowRow).getAllByRole("button");
      const blueRowButtons = within(blueRow).getAllByRole("button");
      const greenRowButtons = within(greenRow).getAllByRole("button");

      const penalties = screen.getByRole("list", { name: cssPenalties });
      const penaltiesCheckBox = within(penalties).getAllByRole("checkbox");

      expect(redRow).toBeVisible();
      expect(yellowRow).toBeVisible();
      expect(blueRow).toBeVisible();
      expect(greenRow).toBeVisible();

      expect(redRowButtons).toHaveLength(12);
      expect(yellowRowButtons).toHaveLength(12);
      expect(blueRowButtons).toHaveLength(12);
      expect(greenRowButtons).toHaveLength(12);

      expect(penalties).toBeVisible;
      expect(penaltiesCheckBox).toHaveLength(4);
    });

    it("the numbered buttons are disabled appropriately", () => {
      render(
        <GameCard
          member={"testUser1"}
          isOpponent={false}
          gameCardData={gameCardManyMarkedNumbersState}
          cellClick={mockCellClick}
          handleLockRow={mockCellClick}
        />
      );

      const redRow = screen.getByRole("list", { name: ariaLabelRed });
      const yellowRow = screen.getByRole("list", {
        name: ariaLabelYellow,
      });
      const blueRow = screen.getByRole("list", { name: ariaLabelBlue });
      const greenRow = screen.getByRole("list", {
        name: ariaLabelGreen,
      });

      const redButtons = within(redRow).getAllByRole("button");
      const yellowButtons = within(yellowRow).getAllByRole("button");
      const blueButtons = within(blueRow).getAllByRole("button");
      const greenButtons = within(greenRow).getAllByRole("button");

      expect(redButtons[0]).toBeDisabled();
      expect(redButtons[1]).toBeDisabled();
      expect(redButtons[2]).toBeDisabled();
      expect(redButtons[3]).toBeDisabled();
      expect(redButtons[4]).toBeEnabled();

      expect(yellowButtons[0]).toBeDisabled();
      expect(yellowButtons[1]).toBeEnabled();

      expect(blueButtons[1]).toBeDisabled();
      expect(blueButtons[2]).toBeEnabled();

      expect(greenButtons[1]).toBeDisabled();
      expect(greenButtons[2]).toBeEnabled();
    });
  });
});


//BELOW TESTS ARE SKIPPED FOR NOW AS THEY'RE RELATED TO LOCKING ROWS
describe.skip("When a user clicks on a number button", () => {
  test("the button is disabled", async () => {
    render(
      <GameCard
        member={"testUser1"}
        isOpponent={false}
        gameCardData={gameCardBaseState}
        cellClick={mockCellClick}
        handleLockRow={mockCellClick}
      />
    );

    const redRow = screen.getByRole("list", { name: ariaLabelRed });
    const redButtons = within(redRow).getAllByRole("button");
    await user.click(redButtons[0]);

    expect(redButtons[0]).toBeDisabled();
  });

  test("locks the row when number 12 is clicked", async () => {
    render(
      <GameCard
        member={"testUser1"}
        isOpponent={false}
        gameCardData={gameCardManyMarkedNumbersState}
        cellClick={mockCellClick}
        handleLockRow={mockCellClick}
      />
    );

    const redRow = screen.getByRole("list", { name: ariaLabelRed });
    const redButtons = within(redRow).getAllByRole("button");
    await user.click(redButtons[10]);

    redButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  test("the player choice state is updated", async () => {
    const mockSetPlayerChoice = vi.fn();

    render(
      <GameCard
        member={"testUser1"}
        isOpponent={false}
        gameCardData={gameCardBaseState}
        cellClick={mockCellClick}
        handleLockRow={mockCellClick}
      />
    );

    const redRow = screen.getByRole("list", { name: ariaLabelRed });
    const redButtons = within(redRow).getAllByRole("button");
    await user.click(redButtons[0]);

    expect(mockSetPlayerChoice).toHaveBeenCalledWith("red", 2);
  });

});

describe.skip("When a row is locked", () => {
  test("all buttons of that row should be disabled", async () => {
    render(
      <GameCard
        member={"testUser1"}
        isOpponent={false}
        gameCardData={gameCardPlayerLockedRowState}
        cellClick={mockCellClick}
        handleLockRow={mockCellClick}
      />
    );

    const redRow = screen.getByRole("list", { name: ariaLabelRed });
    const redButtons = within(redRow).getAllByRole("button");
    redButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });
});


