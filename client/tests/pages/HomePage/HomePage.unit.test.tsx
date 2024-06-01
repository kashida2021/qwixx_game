import { describe, test, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import React from "react";
import Home from "../../../src/pages/HomePage/HomePage";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { socket } from "../../../src/services/socketServices";

const user = userEvent.setup();

const setLobbyIdMock = vi.fn();
const setUserIdMock = vi.fn();

describe("Home Page Unit Test:", () => {
 it("renders the page", () => {
  render(
   <MemoryRouter>
    <Home
     socket={socket}
     isConnected={true}
     setLobbyId={setLobbyIdMock}
     userId={""}
     setUserId={setUserIdMock}
    />
   </MemoryRouter>
  );

  const h1 = screen.getByRole("heading", { level: 1 });
  const btnCreateLobby = screen.getByRole("button", { name: "Create Lobby" });
  const btnJoinLobby = screen.getByRole("button", { name: "Join Lobby" });

  expect(h1).toHaveTextContent("Qwixx");
  expect(btnCreateLobby).toBeVisible();
  expect(btnJoinLobby).toBeVisible();
 });

 test("when socket isn't connected, button are unclickable", () => {
  render(
   <MemoryRouter>
    <Home
     socket={socket}
     isConnected={false}
     setLobbyId={setLobbyIdMock}
     userId={""}
     setUserId={setUserIdMock}
    />
   </MemoryRouter>
  );

  const createLobbyBtn = screen.getByRole("button", { name: "Create Lobby" });
  const joinLobbyBtn = screen.getByRole("button", { name: "Join Lobby" });

  expect(createLobbyBtn).toBeDisabled();
  expect(joinLobbyBtn).toBeDisabled();
 });

 test("when creating a lobby, display error message if no user ID", async () => {
  render(
   <MemoryRouter>
    <Home
     socket={socket}
     isConnected={true}
     setLobbyId={setLobbyIdMock}
     userId={""}
     setUserId={setUserIdMock}
    />
   </MemoryRouter>
  );
  const createLobbyBtn = screen.getByRole("button", { name: "Create Lobby" });
  await user.click(createLobbyBtn);
  const errorMessage = screen.getByText("Please input user ID first");
  expect(errorMessage).toBeVisible();
 });
});
