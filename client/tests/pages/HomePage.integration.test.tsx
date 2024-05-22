import { describe, test, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import React from "react";
import Home from "../../src/pages/HomePage";
import Lobby from "../../src/pages/Lobby";
import "@testing-library/jest-dom";
import { MemoryRouter, Routes, Route } from "react-router-dom";

const user = userEvent.setup();

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
    <Home />
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
     <Route path="/" element={<Home />} />
     <Route path="/lobby" element={<Lobby />} />
    </Routes>
   </MemoryRouter>
  );

  const btnCreateLobby = screen.getByRole("button", { name: "Create Lobby" });

  await user.click(btnCreateLobby);

  const heading = screen.getByRole("heading", { name: "Lobby" });
	const roomNum = screen.getByText("1234");

  expect(heading).toBeVisible();
	expect(roomNum).toBeVisible(); 
 });

 test("'Join Lobby' modal can pop up and close", async () => {
  render(
   <MemoryRouter>
    <Home />
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
     <Route path="/" element={<Home />} />
     <Route path="/lobby" element={<Lobby />} />
    </Routes>
   </MemoryRouter>
  );

  const btnJoinLobby = screen.getByRole("button", { name: "Join Lobby" });

  await user.click(btnJoinLobby);

  const input = screen.getByRole("textbox");
  const btnJoinLobby2 = screen.getAllByRole("button", { name: "Join Lobby" })[1];
  
	await user.type(input, "1234");
	await user.click(btnJoinLobby2); 

	const heading = screen.getByRole("heading", { name: "Lobby" });
	const roomNum = screen.getByText("1234");

  expect(heading).toBeVisible();
	expect(roomNum).toBeVisible(); 
 });
});
