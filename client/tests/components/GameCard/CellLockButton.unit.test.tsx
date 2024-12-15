import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
//import { userEvent } from "@testing-library/user-event";
import React from "react";
import { LockButton } from "../../../src/components/GameCard/CellLockButton";
import "@testing-library/jest-dom";
import { RowColour } from "../../../src/types/enums";



describe("Lock Button", () => {
  describe("Player:", () => {
    test("button is disabled when locked", () => {
      render(
        <LockButton
          colour={RowColour.Red}
          isOpponent={false}
          handleLockRow={vi.fn}
          isLocked={true}
        />
      );

      const btn = screen.getByRole("button");
      expect(btn).toHaveAttribute("disabled")
    });

    test("button is enabled when unlocked", () => {
      render(
        <LockButton
          colour={RowColour.Red}
          isOpponent={false}
          handleLockRow={vi.fn}
          isLocked={false}
        />
      );

      const btn = screen.getByRole("button");
      expect(btn).not.toHaveAttribute("disabled")
    })
  })

  describe("Opponent:", () => {
    test("renders a span that doesn't have CSS class 'locked' when row isn't locked", () => {
      render(
        <LockButton
          colour={RowColour.Red}
          isOpponent={true}
          handleLockRow={vi.fn}
          isLocked={false}
        />
      );

      const btn = screen.getByLabelText("non-interactive-button");
      expect(btn).toBeVisible()
      expect(btn).not.toHaveClass("locked")
    })

    test("renders a span that has CSS class 'locked' when row is locked", () => {
      render(
        <LockButton
          colour={RowColour.Red}
          isOpponent={true}
          handleLockRow={vi.fn}
          isLocked={true}
        />
      );

      const btn = screen.getByLabelText("non-interactive-button");
      expect(btn).toBeVisible()
      expect(btn).toHaveClass("locked")
    });
  })
});
