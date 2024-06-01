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

describe("Modal:", () => {
 beforeEach(() => {
  vi.restoreAllMocks();
 });

 test("User can input lobby id", async () => {
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

 test("User can't trigger join_lobby unless a user ID and lobby ID is set", async () => {
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
  const joinLobbyBtn = screen.getByRole("button", { name: "Join Lobby" });

  await user.type(input, "1234");
  await user.click(joinLobbyBtn);

  const errorMessage = screen.getByText("User ID and Lobby ID is required");
  expect(errorMessage).toBeVisible();
  expect(setLobbyIdMock).not.toHaveBeenCalled();
 });

 test("User can trigger join_lobby when user ID and lobby ID is set", async () => {
  render(
   <MemoryRouter>
    <Modal
     socket={socket}
     userId={"test_user"}
     setLobbyId={setLobbyIdMock}
     toggleModal={toggleModalMock}
    />
   </MemoryRouter>
  );
  const input = screen.getByRole("textbox");
  const joinLobbyBtn = screen.getByRole("button", { name: "Join Lobby" });

  await user.type(input, "1234");
  await user.click(joinLobbyBtn);

  expect(setLobbyIdMock).toHaveBeenCalledWith("1234");
 });
});
