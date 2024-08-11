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

const gameCardData = {
  red: [],
  yellow: [],
  green: [],
  blue: [],
  penalties: []
};

const gameCardDataWithNumbers = {
  red: [],
  yellow: [],
  green: [],
  blue: [],
  penalties: []
};

describe("Game Card Test:", () => {
  it("renders the game card component for player", () => {
    render(<GameCard member={"testUser1"} isOpponent={false} gameCardData={gameCardData}/>);
    screen.debug(); 
    const redRow = screen.getByRole("list", { name: "row-red" });
    const yellowRow = screen.getByRole("list", { name: "row-yellow" });
    const blueRow = screen.getByRole("list", { name: "row-blue" });
    const greenRow = screen.getByRole("list", { name: "row-green" });

    const redRowButtons = within(redRow).getAllByRole("button");
    const yellowRowButtons = within(yellowRow).getAllByRole("button");
    const blueRowButtons = within(blueRow).getAllByRole("button");
    const greenRowButtons = within(greenRow).getAllByRole("button");

    const penalties = screen.getByRole("list", {name: "penalties-list"}); 
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

  it("renders the game card component for opponents", () => {
    render(<GameCard member={"testUser1"} isOpponent={true} gameCardData={gameCardData}/>);

    const redRow = screen.getByRole("list", { name: "row-red" });
    const yellowRow = screen.getByRole("list", { name: "row-yellow" });
    const blueRow = screen.getByRole("list", { name: "row-blue" });
    const greenRow = screen.getByRole("list", { name: "row-green" });

    const redRowButtons = within(redRow).getAllByLabelText("non-interactive-button");
    const yellowRowButtons = within(yellowRow).getAllByLabelText("non-interactive-button");
    const blueRowButtons = within(blueRow).getAllByLabelText("non-interactive-button");
    const greenRowButtons = within(greenRow).getAllByLabelText("non-interactive-button");

    const penalties = screen.getByRole("list", {name: "penalties-list"}); 
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
});
