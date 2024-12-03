import { describe, expect, test, vi } from "vitest"; // it - add later
import { render, screen, waitFor } from "@testing-library/react"; // waitFor, within add later
//import { userEvent } from "@testing-library/user-event";
import React from "react";
import { LockButton } from "../../../src/components/GameCard/CellLockButton";
import "@testing-library/jest-dom";
import { RowColour } from "../../../src/types/enums";



describe("Lock Button", () => {
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
});
