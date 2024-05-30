import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Modal from "../../../src/components/modal/Modal";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
// import socketService from "../../../src/services/socketServices";
import { socket } from "../../../src/services/socketServices";

const user = userEvent.setup();

const toggleModalMock = vi.fn();
const setLobbyIdMock = vi.fn();

// vi.mock("../../src/services/socketServices", () => ({
//  default: {
//   connect: vi.fn(() => {
//    console.log("connected");
//   }),
//   getSocket: vi.fn(),
//   emit: vi.fn((event) => {
//    if (event === "create_lobby") {
//     console.log("Emit handled");
//    }
//   }),
//   on: vi.fn((event, callback) => {
//    if (event === "create_lobby_success") {
//     console.log("Mock was called");
//     callback("1234"); // Simulate server response
//    }
//   }),
//   off: vi.fn(),
//  },
// }));

describe("Modal:", () => {
 beforeEach(() => {
  vi.restoreAllMocks();
 });

 test("User can input lobby id", async () => {
  // setLobbyIdMock.mockReturnValue("1234");

  render(
   <MemoryRouter>
    <Modal
     socket={socket}
     userId={""}
     setLobbyId={setLobbyIdMock}
     toggleModal={toggleModalMock}
    />
   </MemoryRouter>
  );

  const input = screen.getByRole("textbox");

  await user.type(input, "1234");
  screen.debug();
  expect(input).toHaveValue("1234");
 });

 test("User can't input an id that's longer than 4 digits", async () => {
  render(
   <MemoryRouter>
    <Modal
     socket={socket}
     userId={""}
     setLobbyId={setLobbyIdMock}
     toggleModal={toggleModalMock}
    />
   </MemoryRouter>
  );

  const input = screen.getByRole("textbox");

  await user.type(input, "12345");
  expect(input).toHaveValue("1234");
 });

 test("User can input digits only", async () => {
  render(
   <MemoryRouter>
    <Modal
     socket={socket}
     userId={""}
     setLobbyId={setLobbyIdMock}
     toggleModal={toggleModalMock}
    />
   </MemoryRouter>
  );

  const input = screen.getByRole("textbox");

  await user.type(input, "12xd");
  expect(input).toHaveValue("12");
 });
});
