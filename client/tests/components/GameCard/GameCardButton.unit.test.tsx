
import { describe, expect, test, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import React from "react";
import { GameCardButton } from "../../../src/components/GameCard/GameCardButton";
import "@testing-library/jest-dom";
import { RowColour } from "../../../src/types/enums";

const onClickHandler = vi.fn()
const user = userEvent.setup()

describe("Lock Button", () => {
  describe("Player:", () => {
    describe("number button:", () => {
      it("is a clickable number button", () => {
        render(
          <GameCardButton
            type="num-btn"
            label={2}
            rowColour={RowColour.Red}
            isOpponent={false}
            isDisabled={false}
            classAttributes={""}
            eventHandler={onClickHandler}
          />
        );

        const btn = screen.getByRole("button");
        expect(btn).toHaveTextContent("2")
        expect(btn).toHaveClass("number-btn red")
        expect(btn).not.toHaveClass("lock-btn disabled clicked")
        expect(btn).not.toHaveAttribute("disabled")

        const span = screen.queryByLabelText("non-interactive-button")
        expect(span).not.toBeInTheDocument()
      })

      it("is a disabled number button when 'clicked'", () => {
        render(
          <GameCardButton
            type="num-btn"
            label={2}
            rowColour={RowColour.Red}
            isOpponent={false}
            isDisabled={true}
            classAttributes={"clicked"}
            eventHandler={onClickHandler}
          />
        );

        const btn = screen.getByRole("button");
        expect(btn).toHaveTextContent("2")
        expect(btn).toHaveClass("number-btn red clicked")
        expect(btn).not.toHaveClass("lock-btn disabled")
        expect(btn).toHaveAttribute("disabled")

        const span = screen.queryByLabelText("non-interactive-button")
        expect(span).not.toBeInTheDocument()
      })

      it("is a disabled number button when locked or inactive", () => {
        render(
          <GameCardButton
            type="num-btn"
            label={2}
            rowColour={RowColour.Red}
            isOpponent={false}
            isDisabled={true}
            classAttributes={"disabled"}
            eventHandler={onClickHandler}
          />
        );

        const btn = screen.getByRole("button");
        expect(btn).toHaveTextContent("2")
        expect(btn).toHaveClass("number-btn red disabled")
        expect(btn).not.toHaveClass("lock-btn clicked")
        expect(btn).toHaveAttribute("disabled")

        const span = screen.queryByLabelText("non-interactive-button")
        expect(span).not.toBeInTheDocument()
      })

      it("sends a row colour and number args when clicked", async () => {
        render(
          <GameCardButton
            type="num-btn"
            label={2}
            rowColour={RowColour.Red}
            isOpponent={false}
            isDisabled={false}
            classAttributes={""}
            eventHandler={onClickHandler}
          />
        );

        const btn = screen.getByRole("button");
        await user.click(btn)
        expect(onClickHandler).toHaveBeenCalledWith("red", 2)
      })
    })

    describe("Lock button:", () => {
      it("is a clickable lock button when game conditions are met", () => {
        render(
          <GameCardButton
            type="lock-btn"
            label={"🔒"}
            rowColour={RowColour.Red}
            isOpponent={false}
            isDisabled={false}
            classAttributes={""}
            eventHandler={onClickHandler}
          />
        );

        const btn = screen.getByRole("button");
        expect(btn).toHaveTextContent("🔒")
        expect(btn).toHaveClass("lock-btn red")
        expect(btn).not.toHaveClass("number-btn disabled clicked")
        expect(btn).not.toHaveAttribute("disabled")

        const span = screen.queryByLabelText("non-interactive-button")
        expect(span).not.toBeInTheDocument()
      })

      it("is a disabled lock button when 'clicked'", () => {
        render(
          <GameCardButton
            type="lock-btn"
            label={"🔒"}
            rowColour={RowColour.Red}
            isOpponent={false}
            isDisabled={true}
            classAttributes={"clicked"}
            eventHandler={onClickHandler}
          />
        );

        const btn = screen.getByRole("button");
        expect(btn).toHaveTextContent("🔒")
        expect(btn).toHaveClass("lock-btn red clicked")
        expect(btn).not.toHaveClass("number-btn disabled")
        expect(btn).toHaveAttribute("disabled")

        const span = screen.queryByLabelText("non-interactive-button")
        expect(span).not.toBeInTheDocument()
      })

      it("is a disabled lock button when locked or inactive", () => {
        render(
          <GameCardButton
            type="lock-btn"
            label={"🔒"}
            rowColour={RowColour.Red}
            isOpponent={false}
            isDisabled={true}
            classAttributes={"disabled"}
            eventHandler={onClickHandler}
          />
        );

        const btn = screen.getByRole("button");
        expect(btn).toHaveTextContent("🔒")
        expect(btn).toHaveClass("lock-btn red disabled")
        expect(btn).not.toHaveClass("number-btn clicked")
        expect(btn).toHaveAttribute("disabled")

        const span = screen.queryByLabelText("non-interactive-button")
        expect(span).not.toBeInTheDocument()
      })

      it("sends a row colour arg when clicked", async () => {
        render(
          <GameCardButton
            type="lock-btn"
            label={"🔒"}
            rowColour={RowColour.Red}
            isOpponent={false}
            isDisabled={false}
            classAttributes={""}
            eventHandler={onClickHandler}
          />
        );

        const btn = screen.getByRole("button");
        await user.click(btn)
        expect(onClickHandler).toHaveBeenCalledWith("red")
        expect(onClickHandler).not.toHaveBeenCalledWith(2)
      })
    })
  })

  describe("Opponent:", () => {
    describe("Number button:", () => {
      it("is a span that doesn't have a 'disabled' class when opponent hasn't 'clicked'", () => {
        render(
          <GameCardButton
            type="num-btn"
            label={2}
            rowColour={RowColour.Red}
            isOpponent={true}
            isDisabled={false}
            classAttributes={""}
            eventHandler={onClickHandler}
          />
        );

        const span = screen.getByLabelText("non-interactive-button");
        expect(span).toHaveTextContent("2")
        expect(span).toBeVisible()
        expect(span).toHaveClass("number-btn red")
        expect(span).not.toHaveClass("lock-btn disabled clicked")
        expect(span).not.toHaveAttribute("disabled")

        const button = screen.queryByRole("button")
        expect(button).not.toBeInTheDocument()
      })

      it("is a span that has a 'clicked' class when opponent has 'clicked'", () => {
        render(
          <GameCardButton
            type="num-btn"
            label={2}
            rowColour={RowColour.Red}
            isOpponent={true}
            isDisabled={true}
            classAttributes={"clicked"}
            eventHandler={onClickHandler}
          />
        );

        const span = screen.getByLabelText("non-interactive-button");
        expect(span).toHaveTextContent("2")
        expect(span).toBeVisible()
        expect(span).toHaveClass("number-btn red clicked")
        expect(span).not.toHaveClass("lock-btn disabled")
        expect(span).not.toHaveAttribute("disabled")

        const button = screen.queryByRole("button")
        expect(button).not.toBeInTheDocument()
      })

      it("is a span that has a 'disabled' class when number is inactive or row is locked", () => {
        render(
          <GameCardButton
            type="num-btn"
            label={2}
            rowColour={RowColour.Red}
            isOpponent={true}
            isDisabled={true}
            classAttributes={"disabled"}
            eventHandler={onClickHandler}
          />
        );

        const span = screen.getByLabelText("non-interactive-button");
        expect(span).toHaveTextContent("2")
        expect(span).toBeVisible()
        expect(span).toHaveClass("number-btn red disabled")
        expect(span).not.toHaveClass("lock-btn clicked")
        expect(span).not.toHaveAttribute("disabled")

        const button = screen.queryByRole("button")
        expect(button).not.toBeInTheDocument()
      })
    })

    describe("Lock button:", () => {
      it("is a span that doesn't have a 'disabled' class when opponent's game conditions are met", () => {
        render(
          <GameCardButton
            type="lock-btn"
            label={"🔒"}
            rowColour={RowColour.Red}
            isOpponent={true}
            isDisabled={false}
            classAttributes={""}
            eventHandler={onClickHandler}
          />
        );

        const span = screen.getByLabelText("non-interactive-button");
        expect(span).toHaveTextContent("🔒")
        expect(span).toBeVisible()
        expect(span).toHaveClass("lock-btn red")
        expect(span).not.toHaveClass("number-btn disabled clicked")
        expect(span).not.toHaveAttribute("disabled")

        const button = screen.queryByRole("button")
        expect(button).not.toBeInTheDocument()
      })

      it("is a span that has a 'clicked' class when opponent has clicked the lock button", () => {
        render(
          <GameCardButton
            type="lock-btn"
            label={"🔒"}
            rowColour={RowColour.Red}
            isOpponent={true}
            isDisabled={false}
            classAttributes={"clicked"}
            eventHandler={onClickHandler}
          />
        );

        const span = screen.getByLabelText("non-interactive-button");
        expect(span).toHaveTextContent("🔒")
        expect(span).toBeVisible()
        expect(span).toHaveClass("lock-btn red clicked")
        expect(span).not.toHaveClass("number-btn disabled")
        expect(span).not.toHaveAttribute("disabled")

        const button = screen.queryByRole("button")
        expect(button).not.toBeInTheDocument()
      })

      it("is a span that has a 'disabled' class when opponent's game conditions aren't met or row is locked", () => {
        render(
          <GameCardButton
            type="lock-btn"
            label={"🔒"}
            rowColour={RowColour.Red}
            isOpponent={true}
            isDisabled={true}
            classAttributes={"disabled"}
            eventHandler={onClickHandler}
          />
        );

        const span = screen.getByLabelText("non-interactive-button");
        expect(span).toHaveTextContent("🔒")
        expect(span).toBeVisible()
        expect(span).toHaveClass("lock-btn red disabled")
        expect(span).not.toHaveClass("number-btn clicked")
        expect(span).not.toHaveAttribute("disabled")

        const button = screen.queryByRole("button")
        expect(button).not.toBeInTheDocument()
      })
    })
  })
});
