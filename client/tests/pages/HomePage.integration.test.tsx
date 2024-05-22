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
  expect(heading).toBeVisible();
 });

 test("'Join Lobby' modal can pop up and close", async () => {
  render(
   <MemoryRouter>
    <Home />
   </MemoryRouter>
  );

  expect(
   screen.queryByText("Enter the 4 digit room ID.")
  ).not.toBeInTheDocument();

  const btnJoinLobby = screen.getByRole("button", { name: "Join Lobby" });

  await user.click(btnJoinLobby);

  const instructions = screen.getByText("Enter the 4 digit room ID.");

  expect(instructions).toBeVisible();

  const btnClose = screen.getByRole("button", { name: "X" });

  await user.click(btnClose);

  expect(
   screen.queryByText("Enter the 4 digit room ID.")
  ).not.toBeInTheDocument();
 });
});

// describe("HomePage", () => {
//  it("renders the page", () => {
//   render(<Home />);
//   const h1 = screen.getByRole("heading");
// //   const input = screen.getByRole("textbox", { name: "" });
// //   const btn = screen.getByRole("button", { name: "Join Room" });
//   expect(h1).toHaveTextContent("Qwixx");
// //   expect(input).toBeVisible();
// //   expect(btn).toBeVisible();
//  });

//  //A user can select to join a room or to make a lobby
//  //If make a lobby, then the room no. can be randomly assigned
//  //User clicks on make lobby
//  //Get's navigated to a new page
//  //Expect on new page elements.

//  //Maybe can mock the random room no. so that thest is more controlled

//  test("when a user successfully joins a room", () => {
//   render(<Home />);
//   const input = screen.getByRole("textbox", { name: "" });
//   const btn = screen.getByRole("button", { name: "Join Room" });
//   user.type(input, "1");
//   user.click(btn);

//   const roomNum = screen.getByText("Lobby");
//   expect(roomNum).toBeVisible();
//  });
// });
