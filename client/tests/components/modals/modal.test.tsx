import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Modal from "../../../src/components/modal/Modal";
import React from "react";

const user = userEvent.setup();

const toggleModalMock = vi.fn(); 

describe("Modal", () => {
 test("User can input lobby id", async () => {
  render(<Modal toggleModal={toggleModalMock}/>);

  const input = screen.getByRole("textbox"); 

  await user.type(input, "1234"); 

  expect(input).toHaveValue("1234")
 });

 test("User can't input an id that's longer than 4 digits", async () => {
    render(<Modal toggleModal={toggleModalMock}/>);

    const input = screen.getByRole("textbox");

    await user.type(input, "12345");

    expect(input).toHaveValue("1234"); 
 })

 test("User can input digits only", async () => {
   render(<Modal toggleModal={toggleModalMock}/>);

   const input = screen.getByRole("textbox");

   await user.type(input, "12xd");

   expect(input).toHaveValue("12"); 
 })
});
