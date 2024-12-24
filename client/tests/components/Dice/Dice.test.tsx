import Die from "../../../src/components/Dice/Die";
import { vi, it, describe, test, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";

describe("Die component test", () => {
  it("renders coloured die correctly", () => {
    render(<Die colour={"red"} colourKey={"red"} value={1} />);

    const redDie = screen.getByLabelText("red die");
    expect(redDie).toHaveClass("face dice red");

    const pip = within(redDie).getAllByLabelText("die pip");
    expect(pip).toHaveLength(1);
    expect(pip[0]).toHaveStyle("background-color: rgb(255, 255, 255)");
  });

  it("renders white die correctly ", () => {
    render(<Die colour={"white"} colourKey={"white"} value={1} />);

    const redDie = screen.getByLabelText("white die");
    expect(redDie).toHaveClass("face dice white");

    const pip = within(redDie).getAllByLabelText("die pip");
    expect(pip).toHaveLength(1);
    expect(pip[0]).toHaveStyle("background-color: rgb(51, 51, 51)");
  });
});
