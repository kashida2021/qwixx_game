import { describe, expect, test, it, vi } from "vitest"; // it - add later
import { render, screen } from "@testing-library/react"; // waitFor, within add later
import { userEvent } from "@testing-library/user-event";
import React from "react";
import Row from "../../../src/components/GameCard/Row";
import "@testing-library/jest-dom";
import { RowColour } from "../../../src/types/enums";
import {
  gameCardBaseState,
  gameCardMarkedState,
  gameCardTwoMarkedNumbersState,
  gameCardLockRowConditionSatisfiedState,
  gameCardPlayerLockedRowState,
  gameCardOpponentLockedRowState
}
  from "./__fixtures__/gameCardStates";


const mockCellClick = vi.fn();

const numbers = 11;

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

const ariaLabelNonInteractiveButton = "non-interactive-button";
const ariaLabelInteractiveButton = "interactive-button"

const user = userEvent.setup();

describe("Row component test:", () => {
  describe("Player's Card:", () => {
    describe("Numbered buttons:", () => {
      it("should be clickable when game starts", () => {
        render(
          <Row
            rowColour={RowColour.Red}
            rowIndex={1}
            numbers={numbers}
            isOpponent={false}
            cellClick={mockCellClick}
            gameCardData={gameCardBaseState}
            handleLockRow={mockCellClick}
          />
        )

        const redButtons = screen.getAllByLabelText(ariaLabelInteractiveButton)

        redButtons
          .filter((button, index) => index < numbers)
          .forEach((button) => {
            expect(button).toHaveClass(`${cssBtn} ${cssRedBtn}`)
            expect(button).not.toHaveClass(`${cssDisabledBtn}`)
            expect(button).not.toHaveClass(`${cssClickedBtn}`)
            expect(button).not.toBeDisabled()
          }
          )
      })

      it("should be disabled when marked", () => {
        render(
          <Row
            rowColour={RowColour.Red}
            rowIndex={1}
            numbers={numbers}
            isOpponent={false}
            cellClick={mockCellClick}
            gameCardData={gameCardMarkedState}
            handleLockRow={mockCellClick}
          />
        )

        const red6Btn = screen.getByText("6")
        expect(red6Btn).toHaveClass(`${cssBtn} ${cssRedBtn} ${cssClickedBtn}`)
        expect(red6Btn).toBeDisabled()
      })

      it("should be disabled if their values are below a marked number and aren't clicked", () => {
        render(
          <Row
            rowColour={RowColour.Red}
            rowIndex={1}
            numbers={numbers}
            isOpponent={false}
            cellClick={mockCellClick}
            gameCardData={gameCardMarkedState}
            handleLockRow={mockCellClick}
          />
        )

        const redButtons = screen.getAllByLabelText(ariaLabelInteractiveButton)

        redButtons
          .filter((button, index) => index < 4)
          .forEach((button) => {
            expect(button).toHaveClass(`${cssBtn} ${cssRedBtn} ${cssDisabledBtn}`)
            expect(button).toBeDisabled()
          })
      })

      it("should be enabled if their values are above a marked number", () => {
        render(
          <Row
            rowColour={RowColour.Red}
            rowIndex={1}
            numbers={numbers}
            isOpponent={false}
            cellClick={mockCellClick}
            gameCardData={gameCardMarkedState}
            handleLockRow={mockCellClick}
          />
        )

        const redButtons = screen.getAllByLabelText(ariaLabelInteractiveButton)

        redButtons
          .filter((button, index) => index > 4 && index < numbers)
          .forEach((button) => {
            expect(button).toHaveClass(`${cssBtn} ${cssRedBtn}`)
            expect(button).not.toHaveClass(`${cssClickedBtn}`)
            expect(button).not.toHaveClass(`${cssDisabledBtn}`)
            expect(button).not.toBeDisabled()
          })
      })

      it("should be disabled if their values are between 2 marked numbers and aren't clicked", () => {
        render(
          <Row
            rowColour={RowColour.Red}
            rowIndex={1}
            numbers={numbers}
            isOpponent={false}
            cellClick={mockCellClick}
            gameCardData={gameCardTwoMarkedNumbersState}
            handleLockRow={mockCellClick}
          />
        )
        screen.debug
        const redButtons = screen.getAllByLabelText(ariaLabelInteractiveButton)

        redButtons
          .filter((button, index) => index < 4)
          .forEach((button) => {
            expect(button).toHaveClass(`${cssBtn} ${cssRedBtn} ${cssDisabledBtn}`)
            expect(button).not.toHaveClass(`${cssClickedBtn}`)
            expect(button).toBeDisabled()
          })

        redButtons
          .filter((button, index) => index > 4 && index < 7)
          .forEach((button) => {
            expect(button).toHaveClass(`${cssBtn} ${cssRedBtn} ${cssDisabledBtn}`)
            expect(button).not.toHaveClass(`${cssClickedBtn}`)
            expect(button).toBeDisabled()
          })
      })

      test("that haven't been marked should be disabled when a row is locked", () => {
        render(
          <Row
            rowColour={RowColour.Red}
            rowIndex={1}
            numbers={numbers}
            isOpponent={false}
            cellClick={mockCellClick}
            gameCardData={gameCardPlayerLockedRowState}
            handleLockRow={mockCellClick}
          />
        )

        const buttons = screen.getAllByLabelText(ariaLabelInteractiveButton)

        buttons
          .filter((button, index) => index > 4 && index < numbers - 1)
          .forEach((button) => {
            expect(button).toHaveClass(`${cssBtn} ${cssRedBtn} ${cssDisabledBtn}`)
            expect(button).not.toHaveClass(`${cssClickedBtn}`)
            expect(button).toBeDisabled()
          })
      })

      test("that haven't been marked should be disabled when an opponent has locked the row", () => {
        render(
          <Row
            rowColour={RowColour.Red}
            rowIndex={1}
            numbers={numbers}
            isOpponent={false}
            cellClick={mockCellClick}
            gameCardData={gameCardOpponentLockedRowState}
            handleLockRow={mockCellClick}
          />
        )

        const buttons = screen.getAllByLabelText(ariaLabelInteractiveButton)

        buttons
          .filter((button, index) => index > 4 && index < numbers)
          .forEach((button) => {
            expect(button).toHaveClass(`${cssBtn} ${cssRedBtn} ${cssDisabledBtn}`)
            expect(button).toBeDisabled()
          })

      })
    });

    describe("Lock Button:", () => {
      it("should be disabled when game starts", () => {
        render(
          <Row
            rowColour={RowColour.Red}
            rowIndex={1}
            numbers={numbers}
            isOpponent={false}
            cellClick={mockCellClick}
            gameCardData={gameCardBaseState}
            handleLockRow={mockCellClick}
          />
        )

        const lockButton = screen.getByText("🔒")
        expect(lockButton).toHaveClass(`${cssBtn} ${cssRedBtn} ${cssDisabledBtn}`)
        expect(lockButton).not.toHaveClass(`${cssClickedBtn}`)
        expect(lockButton).toBeDisabled()
      })

      it("should be enabled when conditions are met", () => {
        render(
          <Row
            rowColour={RowColour.Red}
            rowIndex={1}
            numbers={numbers}
            isOpponent={false}
            cellClick={mockCellClick}
            gameCardData={gameCardLockRowConditionSatisfiedState}
            handleLockRow={mockCellClick}
          />
        )

        const lockButton = screen.getByText(`🔒`)
        expect(lockButton).toHaveClass(`${cssBtn} ${cssRedBtn}`)
        expect(lockButton).not.toHaveClass(`${cssDisabledBtn}`)
        expect(lockButton).not.toHaveClass(`${cssClickedBtn}`)
        expect(lockButton).not.toBeDisabled()
      })

      it("should be disabled when clicked", () => {
        render(
          <Row
            rowColour={RowColour.Red}
            rowIndex={1}
            numbers={numbers}
            isOpponent={false}
            cellClick={mockCellClick}
            gameCardData={gameCardPlayerLockedRowState}
            handleLockRow={mockCellClick}
          />
        )

        const lockButton = screen.getByText("🔒")
        expect(lockButton).toHaveClass(`${cssBtn} ${cssRedBtn} ${cssClickedBtn}`)
        expect(lockButton).not.toHaveClass(`${cssDisabledBtn}`)
        expect(lockButton).toBeDisabled()
      })

      it("should be disabled when row is locked by another player", () => {
        render(
          <Row
            rowColour={RowColour.Red}
            rowIndex={1}
            numbers={numbers}
            isOpponent={false}
            cellClick={mockCellClick}
            gameCardData={gameCardOpponentLockedRowState}
            handleLockRow={mockCellClick}
          />
        )

        const lockButton = screen.getByText("🔒")
        expect(lockButton).toHaveClass(`${cssBtn} ${cssRedBtn} ${cssDisabledBtn}`)
        expect(lockButton).not.toHaveClass(`${cssClickedBtn}`)
        expect(lockButton).toBeDisabled()
      })
    });
  })

  describe("Opponent's Card:", () => {
    describe("Numbered spans:", () => {
      it("shouldn't have a disabled or clicked CSS class on initial state", () => {
        render(
          <Row
            rowColour={RowColour.Red}
            rowIndex={1}
            numbers={numbers}
            isOpponent={true}
            cellClick={mockCellClick}
            gameCardData={gameCardBaseState}
            handleLockRow={mockCellClick}
          />
        )

        const redButtons = screen.getAllByLabelText(ariaLabelNonInteractiveButton)

        redButtons
          .filter((button, index) => index < numbers)
          .forEach((button) => {
            expect(button).toHaveClass(`${cssSpan} ${cssRedSpan}`)
            expect(button).not.toHaveClass(`${cssDisabledBtn}`)
            expect(button).not.toHaveClass(`${cssClickedBtn}`)
          }
          )

        const lockButton = screen.getByText("🔒")
        expect(lockButton).toHaveClass(`${cssSpan} ${cssRedSpan} ${cssDisabledBtn}`)
      })


      it("should have a 'clicked' CSS class when it has been marked", () => {
        render(
          <Row
            rowColour={RowColour.Red}
            rowIndex={1}
            numbers={numbers}
            isOpponent={true}
            cellClick={mockCellClick}
            gameCardData={gameCardMarkedState}
            handleLockRow={mockCellClick}
          />
        )

        const red6button = screen.getByText("6")
        expect(red6button).toHaveClass(`${cssSpan} ${cssRedSpan} ${cssClickedBtn}`)
      })

      it("should have a 'disabled' CSS class if their values are below a marked number and aren't clicked", () => {
        render(
          <Row
            rowColour={RowColour.Red}
            rowIndex={1}
            numbers={numbers}
            isOpponent={true}
            cellClick={mockCellClick}
            gameCardData={gameCardMarkedState}
            handleLockRow={mockCellClick}
          />
        )

        const redButtons = screen.getAllByLabelText(ariaLabelNonInteractiveButton)

        redButtons
          .filter((button, index) => index < 4)
          .forEach((button) => {
            expect(button).toHaveClass(`${cssSpan} ${cssRedSpan} ${cssDisabledBtn}`)
            expect(button).not.toHaveClass(`${cssClickedBtn}`)
          }
          )
      })

      it("shouldn't have a 'disabled' CSS class if their values are above a marked number", () => {
        render(
          <Row
            rowColour={RowColour.Red}
            rowIndex={1}
            numbers={numbers}
            isOpponent={true}
            cellClick={mockCellClick}
            gameCardData={gameCardMarkedState}
            handleLockRow={mockCellClick}
          />
        )

        const redButtons = screen.getAllByLabelText(ariaLabelNonInteractiveButton)

        redButtons
          .filter((button, index) => index > 4 && index < numbers)
          .forEach((button) => {
            expect(button).toHaveClass(`${cssSpan} ${cssRedSpan}`)
            expect(button).not.toHaveClass(`${cssClickedBtn} ${cssDisabledBtn}`)
          }
          )
      })

      it("should have a 'disabled' CSS class if their values are between two marked numbers and aren't clicked", () => {
        render(
          <Row
            rowColour={RowColour.Red}
            rowIndex={1}
            numbers={numbers}
            isOpponent={true}
            cellClick={mockCellClick}
            gameCardData={gameCardTwoMarkedNumbersState}
            handleLockRow={mockCellClick}
          />
        )

        const redButtons = screen.getAllByLabelText(ariaLabelNonInteractiveButton)

        redButtons
          .filter((button, index) => index < 4)
          .forEach((button) => {
            expect(button).toHaveClass(`${cssSpan} ${cssRedSpan} ${cssDisabledBtn}`)
            expect(button).not.toHaveClass(`${cssClickedBtn}`)
          }
          )

        redButtons
          .filter((button, index) => index > 4 && index < 7)
          .forEach((button) => {
            expect(button).toHaveClass(`${cssSpan} ${cssRedSpan} ${cssDisabledBtn}`)
            expect(button).not.toHaveClass(`${cssClickedBtn}`)
          })

        redButtons
          .filter((button, index) => index > 7 && index < numbers)
          .forEach((button) => {
            expect(button).toHaveClass(`${cssSpan} ${cssRedSpan}`)
            expect(button).not.toHaveClass(` ${cssClickedBtn} ${cssDisabledBtn}`)
          })
      })

      test("that haven't been marked should be disabled when a row is locked", () => {
        render(
          <Row
            rowColour={RowColour.Red}
            rowIndex={1}
            numbers={numbers}
            isOpponent={true}
            cellClick={mockCellClick}
            gameCardData={gameCardPlayerLockedRowState}
            handleLockRow={mockCellClick}
          />
        )
        const redButtons = screen.getAllByLabelText(ariaLabelNonInteractiveButton)

        redButtons
          .filter((button, index) => index < 4)
          .forEach((button) => {
            expect(button).toHaveClass(`${cssSpan} ${cssRedSpan} ${cssClickedBtn}`)
            expect(button).not.toHaveClass(`${cssDisabledBtn}`)
          }
          )

        redButtons
          .filter((button, index) => index > 4 && index < numbers - 1)
          .forEach((button) => {
            expect(button).toHaveClass(`${cssSpan} ${cssRedSpan} ${cssDisabledBtn}`)
            expect(button).not.toHaveClass(`${cssClickedBtn}`)
          }
          )
      })
    });

    describe("Lock span:", () => {
      it("should have a 'disabled' CSS class on initial state", () => {
        render(
          <Row
            rowColour={RowColour.Red}
            rowIndex={1}
            numbers={numbers}
            isOpponent={true}
            cellClick={mockCellClick}
            gameCardData={gameCardBaseState}
            handleLockRow={mockCellClick}
          />
        )

        const lockButton = screen.getByText("🔒")
        expect(lockButton).toHaveClass(`${cssSpan} ${cssRedSpan} ${cssDisabledBtn}`)
      })

      it("should be enabled when game conditions are met", () => {
        render(
          <Row
            rowColour={RowColour.Red}
            rowIndex={1}
            numbers={numbers}
            isOpponent={true}
            cellClick={mockCellClick}
            gameCardData={gameCardLockRowConditionSatisfiedState}
            handleLockRow={mockCellClick}
          />
        )

        const lockButton = screen.getByText("🔒")
        expect(lockButton).toHaveClass(`${cssSpan} ${cssRedSpan}`)
        expect(lockButton).not.toHaveClass(`${cssDisabledBtn} ${cssClickedBtn}`)
      })

      it("should have a 'clicked' CSS class when it has been clicked", () => {
        render(
          <Row
            rowColour={RowColour.Red}
            rowIndex={1}
            numbers={numbers}
            isOpponent={true}
            cellClick={mockCellClick}
            gameCardData={gameCardPlayerLockedRowState}
            handleLockRow={mockCellClick}
          />
        )

        const lockButton = screen.getByText("🔒")
        expect(lockButton).toHaveClass(`${cssSpan} ${cssRedSpan} ${cssClickedBtn}`)
        expect(lockButton).not.toHaveClass(`${cssDisabledBtn}`)
      })

      it("should have a 'disabled' CSS class when the row is locked by another player", () => {
        render(
          <Row
            rowColour={RowColour.Red}
            rowIndex={1}
            numbers={numbers}
            isOpponent={true}
            cellClick={mockCellClick}
            gameCardData={gameCardOpponentLockedRowState}
            handleLockRow={mockCellClick}
          />
        )

        const lockButton = screen.getByText("🔒")
        expect(lockButton).toHaveClass(`${cssSpan} ${cssRedSpan} ${cssDisabledBtn}`)
        expect(lockButton).not.toHaveClass(`${cssClickedBtn}`)
      })

    });
  });
});
