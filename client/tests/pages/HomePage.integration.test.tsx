import { describe, test, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import React from "react";
import Home from "../../src/pages/HomePage";
import Lobby from "../../src/pages/Lobby";
import "@testing-library/jest-dom";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";

const user = userEvent.setup();

vi.mock("socket.io-client", () => {
 const socketMock = {
  connect: vi.fn(),
  emit: vi.fn(),
  on: vi.fn((event, callback) => {
   if (event === "create_lobby") {
		console.log("create_lobby success")
    setTimeout(() => {
     callback("1234");
    }, 100);
   }
  }),
 };
 return { io: () => socketMock };
});

const mockSocket = io();

// const lobbyIdMock = "1234";

const createLobbyMock = () => {
 mockSocket.emit("create_lobby");
};

// HomePage
// Create Lobby btn
// Join Lobby btn

// Create Lobby
// Random 4 digit no. that gets passed to setRoom()
// Navigates to Lobby Page
// Lobby Page should have "Lobby" and "Room ID" with room_id
// The lobby URL should be something like "*/lobby/:room_id"

// Join Lobby
// Either navigates to a new page where the user will type in a 4digit id
// Or
// A model pop up that a user enters a room id into.

describe("HomePage:", () => {
 it("renders the page", () => {
  render(
   <MemoryRouter>
    <Home createLobby={createLobbyMock} lobbyId={""} />
   </MemoryRouter>
  );
  const h1 = screen.getByRole("heading", { level: 1 });
  const btnCreateLobby = screen.getByRole("button", { name: "Create Lobby" });
  const btnJoinLobby = screen.getByRole("button", { name: "Join Lobby" });

  expect(h1).toHaveTextContent("Qwixx");
  expect(btnCreateLobby).toBeVisible();
  expect(btnJoinLobby).toBeVisible();
 });

 it("navigates to Lobby Page", async () => {
  render(
   <MemoryRouter initialEntries={["/"]}>
    <Routes>
     <Route
      path="/"
      element={<Home createLobby={createLobbyMock} lobbyId={""} />}
     />
     <Route path="/lobby/:lobbyId" element={<Lobby lobbyId={""} />} />
    </Routes>
   </MemoryRouter>
  );

  const btnCreateLobby = screen.getByRole("button", { name: "Create Lobby" });

  await user.click(btnCreateLobby);

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
    <Home createLobby={createLobbyMock} lobbyId={""} />
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
     <Route path="/" element={<Home  createLobby={createLobbyMock} lobbyId={""}/>} />
     <Route path="/lobby" element={<Lobby lobbyId={""}/>} />
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
