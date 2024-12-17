
import { describe, expect, test, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import React from "react";
import { GameCardButton } from "../../../src/components/GameCard/GameCardButton";
import "@testing-library/jest-dom";
import { RowColour } from "../../../src/types/enums";

const onClickHandler = vi.fn()
const user = userEvent.setup()

const cssBtn = "qwixx-card__button"
const cssRedBtn = "qwixx-card__button--red"
const cssYellowBtn = "qwixx-card__button--yellow"
const cssGreenBtn = "qwixx-card__button--green"
const cssBlueBtn = "qwixx-card__button--blue"
const cssDisabledBtn = "qwixx-card__button--disabled"
const cssClickedBtn = "qwixx-card__button--clicked"

const cssSpan = "qwixx-card__span"
const cssRedSpan = "qwixx-card__span--red"
const cssYellowSpan = "qwixx-card__span--yellow"
const cssGreenSpan = "qwixx-card__span--green"
const cssBlueSpan = "qwixx-card__span--blue"

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
        expect(btn).toHaveClass(`${cssBtn} ${cssRedBtn}`)
        expect(btn).not.toHaveClass(`${cssClickedBtn}`)
        expect(btn).not.toHaveClass(`${cssDisabledBtn}`)
        expect(btn).not.toBeDisabled()

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
            classAttributes={`${cssClickedBtn}`}
            eventHandler={onClickHandler}
          />
        );

        const btn = screen.getByRole("button");
        expect(btn).toHaveTextContent("2")
        expect(btn).toHaveClass(`${cssBtn} ${cssRedBtn} ${cssClickedBtn}`)
        expect(btn).not.toHaveClass(`${cssDisabledBtn}`)
        expect(btn).toBeDisabled()

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
            classAttributes={`${cssDisabledBtn}`}
            eventHandler={onClickHandler}
          />
        );

        const btn = screen.getByRole("button");
        expect(btn).toHaveTextContent("2")
        expect(btn).toHaveClass(`${cssBtn} ${cssRedBtn} ${cssDisabledBtn}`)
        expect(btn).not.toHaveClass(`${cssClickedBtn}`)
        expect(btn).toBeDisabled()

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
        expect(btn).toHaveClass(`${cssBtn} ${cssRedBtn}`)
        expect(btn).not.toHaveClass(`${cssClickedBtn}`)
        expect(btn).not.toHaveClass(`${cssDisabledBtn}`)
        expect(btn).not.toBeDisabled()

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
            classAttributes={`${cssClickedBtn}`}
            eventHandler={onClickHandler}
          />
        );

        const btn = screen.getByRole("button");
        expect(btn).toHaveTextContent("🔒")
        expect(btn).toHaveClass(`${cssBtn} ${cssRedBtn} ${cssClickedBtn}`)
        expect(btn).not.toHaveClass(`${cssDisabledBtn}`)
        expect(btn).toBeDisabled()

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
            classAttributes={`${cssDisabledBtn}`}
            eventHandler={onClickHandler}
          />
        );

        const btn = screen.getByRole("button");
        expect(btn).toHaveTextContent("🔒")
        expect(btn).toHaveClass(`${cssBtn} ${cssRedBtn} ${cssDisabledBtn}`)
        expect(btn).not.toHaveClass(`${cssClickedBtn}`)
        expect(btn).toBeDisabled()

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
      it("is a span that doesn't have a 'clicked' class when opponent hasn't 'clicked'", () => {
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
        expect(span).toHaveClass(`${cssSpan} ${cssRedSpan}`)
        expect(span).not.toHaveClass(`${cssClickedBtn}`)
        expect(span).not.toHaveClass(`${cssDisabledBtn}`)
        expect(span).not.toBeDisabled()

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
            classAttributes={`${cssClickedBtn}`}
            eventHandler={onClickHandler}
          />
        );

        const span = screen.getByLabelText("non-interactive-button");
        expect(span).toHaveTextContent("2")
        expect(span).toBeVisible()
        expect(span).toHaveClass(`${cssSpan} ${cssRedSpan} ${cssClickedBtn}`)
        expect(span).not.toHaveClass(`${cssDisabledBtn}`)
        expect(span).not.toBeDisabled()

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
            classAttributes={`${cssDisabledBtn}`}
            eventHandler={onClickHandler}
          />
        );

        const span = screen.getByLabelText("non-interactive-button");
        expect(span).toHaveTextContent("2")
        expect(span).toBeVisible()
        expect(span).toHaveClass(`${cssSpan} ${cssRedSpan} ${cssDisabledBtn}`)
        expect(span).not.toHaveClass(`${cssClickedBtn}`)
        expect(span).not.toBeDisabled()

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
        expect(span).toHaveClass(`${cssSpan} ${cssRedSpan}`)
        expect(span).not.toHaveClass(`${cssDisabledBtn}`)
        expect(span).not.toHaveClass(`${cssClickedBtn}`)
        expect(span).not.toBeDisabled()

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
            classAttributes={`${cssClickedBtn}`}
            eventHandler={onClickHandler}
          />
        );

        const span = screen.getByLabelText("non-interactive-button");
        expect(span).toHaveTextContent("🔒")
        expect(span).toBeVisible()
        expect(span).toHaveClass(`${cssSpan} ${cssRedSpan} ${cssClickedBtn}`)
        expect(span).not.toHaveClass(`${cssDisabledBtn}`)
        expect(span).not.toBeDisabled()

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
            classAttributes={`${cssDisabledBtn}`}
            eventHandler={onClickHandler}
          />
        );

        const span = screen.getByLabelText("non-interactive-button");
        expect(span).toHaveTextContent("🔒")
        expect(span).toBeVisible()
        expect(span).toHaveClass(`${cssSpan} ${cssRedSpan} ${cssDisabledBtn}`)
        expect(span).not.toHaveClass(`${cssClickedBtn}`)
        expect(span).not.toBeDisabled()

        const button = screen.queryByRole("button")
        expect(button).not.toBeInTheDocument()
      })
    })
  })
});
