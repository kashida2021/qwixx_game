import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
//import { userEvent } from "@testing-library/user-event";
import React from "react";
import GameCard from "../../src/components/GameCard/GameCard";
import "@testing-library/jest-dom";
import { socket } from "../../src/services/socketServices";

//const user = userEvent.setup();
// const gameState = {
//   players: {
//     playerId1: {
//       red: [2, 5, 8],
//       yellow: [3],
//     },
//     playerId2: {
//       red: [1, 4],
//       yellow: [],
//     },
//   },
// };

// const thisPlayer = {
//   playerId1: {
//     red: [2, 5, 8],
//     yellow: [3],
//   },
// };

const emptyGameCardData = {
  red: [],
  yellow: [],
  green: [],
  blue: [],
  penalties: [],
};

const gameCardDataWithNumbers = {
  red: [2, 3, 4, 5],
  yellow: [2],
  green: [11],
  blue: [11],
  penalties: [],
};

const classAttributeRowRed = "row-red";
const classAttributeRowYellow = "row-yellow";
const classAttributeRowBlue = "row-blue";
const classAttributeRowGreen = "row-green";

const classAttributePenalties = "penalties-list";

const classAttributeNonInteractiveButton = "non-interactive-button";

const classAttributeClicked = "clicked";

describe("Game Card Test:", () => {
  describe("Renders the game card component for:", () => {
    it("player", () => {
      render(
        <GameCard
          member={"testUser1"}
          isOpponent={false}
          gameCardData={emptyGameCardData}
        />
      );

      const redRow = screen.getByRole("list", { name: classAttributeRowRed });
      const yellowRow = screen.getByRole("list", {
        name: classAttributeRowYellow,
      });
      const blueRow = screen.getByRole("list", { name: classAttributeRowBlue });
      const greenRow = screen.getByRole("list", {
        name: classAttributeRowGreen,
      });

      const redRowButtons = within(redRow).getAllByRole("button");
      const yellowRowButtons = within(yellowRow).getAllByRole("button");
      const blueRowButtons = within(blueRow).getAllByRole("button");
      const greenRowButtons = within(greenRow).getAllByRole("button");

      const penalties = screen.getByRole("list", {
        name: classAttributePenalties,
      });
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

    it("opponents", () => {
      render(
        <GameCard
          member={"testUser1"}
          isOpponent={true}
          gameCardData={emptyGameCardData}
        />
      );

      const redRow = screen.getByRole("list", { name: classAttributeRowRed });
      const yellowRow = screen.getByRole("list", {
        name: classAttributeRowYellow,
      });
      const blueRow = screen.getByRole("list", { name: classAttributeRowBlue });
      const greenRow = screen.getByRole("list", {
        name: classAttributeRowGreen,
      });

      const redRowButtons = within(redRow).getAllByLabelText(
        classAttributeNonInteractiveButton
      );
      const yellowRowButtons = within(yellowRow).getAllByLabelText(
        classAttributeNonInteractiveButton
      );
      const blueRowButtons = within(blueRow).getAllByLabelText(
        classAttributeNonInteractiveButton
      );
      const greenRowButtons = within(greenRow).getAllByLabelText(
        classAttributeNonInteractiveButton
      );

      const penalties = screen.getByRole("list", {
        name: classAttributePenalties,
      });
      const penaltiesCheckBox =
        within(penalties).getAllByLabelText("fake-checkbox");

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
  });

  describe("When the GameCard component receives game state", () => {
    it("the numbered buttons are disabled appropriately for the player's card", () => {
      render(
        <GameCard
          member={"testUser1"}
          isOpponent={false}
          gameCardData={gameCardDataWithNumbers}
        />
      );

      const redRow = screen.getByRole("list", { name: classAttributeRowRed });
      const yellowRow = screen.getByRole("list", {
        name: classAttributeRowYellow,
      });
      const blueRow = screen.getByRole("list", { name: classAttributeRowBlue });
      const greenRow = screen.getByRole("list", {
        name: classAttributeRowGreen,
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

    it("the numbered cells have the 'clicked' attribute for the opponent's card", () => {
      render(
        <GameCard
          member={"testUser1"}
          isOpponent={true}
          gameCardData={gameCardDataWithNumbers}
        />
      );

      const redRow = screen.getByRole("list", { name: classAttributeRowRed });
      const yellowRow = screen.getByRole("list", {
        name: classAttributeRowYellow,
      });
      const blueRow = screen.getByRole("list", { name: classAttributeRowBlue });
      const greenRow = screen.getByRole("list", {
        name: classAttributeRowGreen,
      });

      const redButtons = within(redRow).getAllByLabelText(
        classAttributeNonInteractiveButton
      );
      const yellowButtons = within(yellowRow).getAllByLabelText(
        classAttributeNonInteractiveButton
      );
      const blueButtons = within(blueRow).getAllByLabelText(
        classAttributeNonInteractiveButton
      );
      const greenButtons = within(greenRow).getAllByLabelText(
        classAttributeNonInteractiveButton
      );

      expect(redButtons[0]).toHaveClass(classAttributeClicked);
      expect(redButtons[1]).toHaveClass(classAttributeClicked);
      expect(redButtons[2]).toHaveClass(classAttributeClicked);
      expect(redButtons[3]).toHaveClass(classAttributeClicked);
      expect(redButtons[4]).not.toHaveClass(classAttributeClicked);

      expect(yellowButtons[0]).toHaveClass(classAttributeClicked);
      expect(yellowButtons[1]).not.toHaveClass(classAttributeClicked);

      expect(blueButtons[1]).toHaveClass(classAttributeClicked);
      expect(blueButtons[2]).not.toHaveClass(classAttributeClicked);

      expect(greenButtons[1]).toHaveClass(classAttributeClicked);
      expect(greenButtons[2]).not.toHaveClass(classAttributeClicked);
    });
  });
});
