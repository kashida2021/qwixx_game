import { describe, test, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import React from "react";
import Home from "../../src/pages/HomePage/HomePage";
import Lobby from "../../src/pages/Lobby/Lobby";
import "@testing-library/jest-dom";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import socketService from "../../src/services/socketServices";

const user = userEvent.setup();

vi.mock("../../src/services/socketServices", () => ({
 default: {
  connect: vi.fn(() => {
   console.log("connected");
  }),
  getSocket: vi.fn(),
  emit: vi.fn((event) => {
   if (event === "create_lobby") {
    console.log("Emit handled");
   }
  }),
  on: vi.fn((event, callback) => {
   if (event === "create_lobby_success") {
    console.log("Mock was called");
    callback("1234"); // Simulate server response
   }
  }),
 },
}));

// vi.spyOn(socketService, "emit").mockImplementation((event) => {
//  if (event === "create_lobby_success") {
//   console.log("Mocked emit called");
//  }
// });

const setLobbyIdMock = vi.fn();

describe("HomePage:", () => {
 it("renders the page", () => {
  render(
   <MemoryRouter>
    <Home setLobbyId={setLobbyIdMock} />
   </MemoryRouter>
  );
  const h1 = screen.getByRole("heading", { level: 1 });
  const btnCreateLobby = screen.getByRole("button", { name: "Create Lobby" });
  const btnJoinLobby = screen.getByRole("button", { name: "Join Lobby" });

  expect(h1).toHaveTextContent("Qwixx");
  expect(btnCreateLobby).toBeVisible();
  expect(btnJoinLobby).toBeVisible();
 });

 it.skip("navigates to Lobby Page", async () => {
  render(
   <MemoryRouter initialEntries={["/"]}>
    <Routes>
     <Route path="/" element={<Home setLobbyId={setLobbyIdMock} />} />
     <Route path="/lobby/:lobbyId" element={<Lobby lobbyId={""} />} />
    </Routes>
   </MemoryRouter>
  );

  const btnCreateLobby = screen.getByRole("button", { name: "Create Lobby" });
  screen.debug();

  await user.click(btnCreateLobby);

  expect(setLobbyIdMock).toHaveBeenCalledWith("1234");
  await waitFor(() => {
   const heading = screen.getByRole("heading", { name: "Lobby" });
   const roomNum = screen.getByText("1234");

   expect(heading).toBeVisible();
   expect(roomNum).toBeVisible();
  });
 });

 test("'Join Lobby' modal can pop up and close", async () => {
  render(
   <MemoryRouter>
    <Home setLobbyId={setLobbyIdMock} />
   </MemoryRouter>
  );

  expect(
   screen.queryByText("Enter the 4 digit lobby ID.")
  ).not.toBeInTheDocument();

  const btnJoinLobby = screen.getByRole("button", { name: "Join Lobby" });

  await user.click(btnJoinLobby);

  const instructions = screen.getByText("Enter the 4 digit lobby ID.");

  expect(instructions).toBeVisible();

  const btnClose = screen.getByRole("button", { name: "X" });

  await user.click(btnClose);

  expect(
   screen.queryByText("Enter the 4 digit lobby ID.")
  ).not.toBeInTheDocument();
 });

 test("Joining a lobby navigates to the correct lobby page", async () => {
  render(
   <MemoryRouter initialEntries={["/"]}>
    <Routes>
     <Route path="/" element={<Home setLobbyId={setLobbyIdMock} />} />
     <Route path="/lobby" element={<Lobby lobbyId={""} />} />
    </Routes>
   </MemoryRouter>
  );

  const btnJoinLobby = screen.getByRole("button", { name: "Join Lobby" });

  await user.click(btnJoinLobby);

  const input = screen.getByRole("textbox");
  const btnJoinLobby2 = screen.getAllByRole("button", {
   name: "Join Lobby",
  })[1];

  await user.type(input, "1234");
  await user.click(btnJoinLobby2);

  const heading = screen.getByRole("heading", { name: "Lobby" });
  const roomNum = screen.getByText("1234");

  expect(heading).toBeVisible();
  expect(roomNum).toBeVisible();
 });
});
