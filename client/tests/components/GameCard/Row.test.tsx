import { describe, expect, test, vi} from "vitest"; // it - add later
import { render, screen, waitFor } from "@testing-library/react"; // waitFor, within add later
import { userEvent } from "@testing-library/user-event";
import React from "react";
import Row from "../../../src/components/GameCard/Row";
import "@testing-library/jest-dom";
import { QwixxLogic } from "../../../src/types/qwixxLogic";
import { RowColour } from "../../../src/types/enums";

//const emptyGameCardData: QwixxLogic['players'][string] = {
  //rows: {
    //red: [],
    //yellow: [],
    //green: [],
    //blue: [],
 // },
 // isLocked: {
   // red: false,
   // yellow: false,
   // green: false,
   // blue: false,
  //},
 // penalties: 0,
//};

const gameCardDataWithNumbers: QwixxLogic['players'][string] = {
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
};

const gameCardWithLockedRow: QwixxLogic['players'][string] = {
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
};

const mockCellClick = vi.fn();

const numbers = 11;
//const classAttributeRowRed = "row-red";
const classAttributeClicked = "clicked";

const classAttributeNonInteractiveButton = "non-interactive-button";
const classAttributeInteractiveLockButton = "interactive-lock-button";

const user = userEvent.setup();

describe("Row component test:", () => {
  //the Current test wont work as the opponents buttons won't have a clicked class unless the row data contains specific number selections
  describe.skip("Opponents Card", () => {
    test("it renders 'buttons' with a 'clicked' css class", () => {
      render(
        <Row
          rowColour={RowColour.Red}
          numbers={numbers}
          isOpponent={true}
          rowIndex={0}
          gameCardData={gameCardDataWithNumbers}
          cellClick={mockCellClick}
        />
      );

      const redButtons = screen.getAllByLabelText(
        classAttributeNonInteractiveButton
      );

      redButtons
        .filter((button, index) => index < 4)
        .forEach((button) => expect(button).toHaveClass(classAttributeClicked));
    });
  });




  //IGNORE THESE TESTS FOR NOW AS THEY'RE RELATED TO LOCKING UI
  describe.skip("Player's Card", () => {
    test("it renders buttons with disabled attribute", () => {
      render(
        <Row
          rowColour={RowColour.Red}
          numbers={numbers}
          isOpponent={false}
          rowIndex={0}
          gameCardData={gameCardDataWithNumbers}
          cellClick={mockCellClick}
        />
      );

      const redButtons = screen.getAllByRole("button");
      const disabledButtons = redButtons.filter((button) =>
        button.hasAttribute("disabled")
      );
      expect(disabledButtons.length).toBe(4);
    });
    test("when a button is clicked it becomes disabled", async () => {
      render(
        <Row
          rowColour={RowColour.Red}
          numbers={numbers}
          isOpponent={false}
          rowIndex={0}
          gameCardData={gameCardDataWithNumbers}
          cellClick={mockCellClick}
        />
      );

      const redButtons = screen.getAllByRole("button");
      await user.click(redButtons[4]);

      expect(redButtons[4]).toBeDisabled();
    });

    test("when a button is clicked the numbers below are disabled", async () => {
      render(
        <Row
          rowColour={RowColour.Red}
          numbers={numbers}
          isOpponent={false}
          rowIndex={0}
          gameCardData={gameCardDataWithNumbers}
          cellClick={mockCellClick}
        />
      );

      const redButtons = screen.getAllByRole("button");
      await user.click(redButtons[4]);

      await waitFor(()=> {
        expect(redButtons[3]).toHaveClass("disabled");
        expect(redButtons[2]).toHaveClass("disabled");
      })
    });


    test("when the row is locked, all buttons are disabled", async () => {
      render(
        <Row
          rowColour={RowColour.Red}
          numbers={numbers}
          isOpponent={false}
          rowIndex={0}
          gameCardData={gameCardWithLockedRow}
          cellClick={mockCellClick}
        />
      );

      const redButtons = screen.getAllByRole("button");
      redButtons.forEach((button) => expect(button).toBeDisabled());
    });

    test("when a user clicks the last number, it locks the row", async () => {
      render(
        <Row
          rowColour={RowColour.Red}
          numbers={numbers}
          isOpponent={false}
          rowIndex={0}
          gameCardData={gameCardDataWithNumbers}
          cellClick={mockCellClick}
        />
      );

      const redButtons = screen.getAllByRole("button");
      const lockButton = screen.getByLabelText(
        classAttributeInteractiveLockButton
      );

      expect(lockButton).toBeDisabled();
      await user.click(redButtons[10]); //clicks number 12
      screen.debug();
      expect(redButtons[10]).toBeDisabled();
      expect(lockButton).toBeEnabled();
      await user.click(lockButton);

      redButtons.forEach((button) => expect(button).toBeDisabled());
    });
  });
});

//clicking confirm button
