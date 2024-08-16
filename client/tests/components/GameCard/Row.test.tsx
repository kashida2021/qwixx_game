import { describe, it, expect, test } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import React from "react";
import Row from "../../../src/components/GameCard/Row";
import "@testing-library/jest-dom";
import { GameCardData } from "../../../src/types/GameCardData";
import { RowColour } from "../../../src/types/enums";

const emptyGameCardData: GameCardData = {
  red: [],
  yellow: [],
  green: [],
  blue: [],
  isLocked: {
    red: false,
    yellow: false,
    green: false,
    blue: false,
  },
  penalties: 0,
};

const gameCardDataWithNumbers: GameCardData = {
  red: [2, 3, 4, 5],
  yellow: [],
  green: [],
  blue: [],
  isLocked: {
    red: false,
    yellow: false,
    green: false,
    blue: false,
  },
  penalties: 0,
};

const gameCardWithLockedRow: GameCardData = {
  red: [2, 3, 4, 5, 12],
  yellow: [],
  green: [],
  blue: [],
  isLocked: {
    red: true,
    yellow: false,
    green: false,
    blue: false,
  },
  penalties: 0,
};

const numbers = 11;
const classAttributeRowRed = "row-red";
const classAttributeNonInteractiveButton = "non-interactive-button";
const classAttributeClicked = "clicked";

const user = userEvent.setup();

describe("Row component test:", () => {
  test("it renders buttons with disabled attribute", () => {
    render(
      <Row
        rowColour={RowColour.Red}
        numbers={numbers}
        isOpponent={false}
        rowIndex={0}
        gameCardData={gameCardDataWithNumbers}
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
      />
    );

    const redButtons = screen.getAllByRole("button");
    await user.click(redButtons[4]);

    expect(redButtons[4]).toBeDisabled();
  });

  test("when the row is locked, all buttons are disabled", async () => {
    render(
      <Row
        rowColour={RowColour.Red}
        numbers={numbers}
        isOpponent={false}
        rowIndex={0}
        gameCardData={gameCardWithLockedRow}
      />
    );

    await waitFor(() => {
      const redButtons = screen.getAllByRole("button");
      screen.debug();
      redButtons.forEach((button) => expect(button).toBeDisabled());
    });
  });
});
