import { describe, test, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import React from "react";
import Home from "../../../src/pages/HomePage/HomePage";
import Lobby from "../../../src/pages/Lobby/Lobby";
import "@testing-library/jest-dom";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { socket } from "../../../src/services/socketServices";
import { create } from "domain";

const user = userEvent.setup();

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

const mockSocket = {
 on: vi.fn(),
 off: vi.fn(),
 emit: vi.fn((event, data, callback) => {
  if (event === "create_lobby") {
   callback({ roomId: "1234" });
  } else if (event === "join_lobby") {
   callback({ roomId: "1234" });
  }
 }),
};

// vi.spyOn(socketService, "emit").mockImplementation((event) => {
//  if (event === "create_lobby_success") {
//   console.log("Mocked emit called");
//  }
// });

const setLobbyIdMock = vi.fn();
const setUserIdMock = vi.fn();
const setErrorMock = vi.fn();
const handleInputChangeMock = vi.fn();
describe("HomePage:", () => {
 //A little bit of an unecessary test
 it("renders the page", () => {
  render(
   <MemoryRouter>
    <Home
     socket={socket}
     isConnected={true}
     lobbyId={""}
     setLobbyId={setLobbyIdMock}
     userId={""}
     setUserId={setUserIdMock}
     error={""}
     setError={setErrorMock}
     //  handleInputChange={handleInputChangeMock}
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

 test("buttons should not be clickable if socket isn't connected", () => {
  render(
   <MemoryRouter>
    <Home
     socket={socket}
     isConnected={false}
     lobbyId={""}
     setLobbyId={setLobbyIdMock}
     userId={""}
     setUserId={setUserIdMock}
     error={""}
     setError={setErrorMock}
     //  handleInputChange={handleInputChangeMock}
    />
   </MemoryRouter>
  );

  const createLobbyBtn = screen.getByRole("button", { name: "Create Lobby" });
  const joinLobbyBtn = screen.getByRole("button", { name: "Join Lobby" });

  expect(createLobbyBtn).toBeDisabled();
  expect(joinLobbyBtn).toBeDisabled();
 });

 test("Should display error message if no user ID", () => {
  render(
   <MemoryRouter>
    <Home
     socket={socket}
     isConnected={true}
     lobbyId={""}
     setLobbyId={setLobbyIdMock}
     userId={""}
     setUserId={setUserIdMock}
     error={""}
     setError={setErrorMock}
     //  handleInputChange={handleInputChangeMock}
    />
   </MemoryRouter>
  );
  const createLobbyBtn = screen.getByRole("button", { name: "Create Lobby" });
  user.click(createLobbyBtn);
  const errorMessage = screen.getByText("Please input user ID first");
  expect(errorMessage).toBeVisible();
 });

 it("navigates to Lobby Page", async () => {
  render(
   <MemoryRouter initialEntries={["/"]}>
    <Routes>
     <Route
      path="/"
      element={
       <Home
        socket={mockSocket}
        isConnected={false}
        lobbyId={""}
        setLobbyId={setLobbyIdMock}
        userId={""}
        setUserId={setUserIdMock}
        error={""}
        setError={setErrorMock}
       />
      }
     />
     <Route path="/lobby/:lobbyId" element={<Lobby lobbyId={""} />} />
    </Routes>
   </MemoryRouter>
  );

  const btnCreateLobby = screen.getByRole("button", { name: "Create Lobby" });

  await user.click(btnCreateLobby);
  screen.debug();
  //   expect(setLobbyIdMock).toHaveBeenCalledWith("1234");
  //   await waitFor(() => {
  //    const heading = screen.getByRole("heading", { name: "Lobby" });
  //    const roomNum = screen.getByText("1234");

  //    expect(heading).toBeVisible();
  //    expect(roomNum).toBeVisible();
  //   });
 });

 test("'Join Lobby' modal can pop up and close", async () => {
  render(
   <MemoryRouter>
    <Home
     socket={socket}
     isConnected={true}
     lobbyId={""}
     setLobbyId={setLobbyIdMock}
     userId={""}
     setUserId={setUserIdMock}
     error={""}
     setError={setErrorMock}
    />
   </MemoryRouter>
  );

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
     <Route
      path="/"
      element={
       <Home
        socket={socket}
        lobbyId={""}
        setLobbyId={setLobbyIdMock}
        userId={""}
        setUserId={setUserIdMock}
        error={""}
        setError={setErrorMock}
        // handleInputChange={handleInputChangeMock}
       />
      }
     />
     <Route path="/lobby" element={<Lobby lobbyId={""} />} />
    </Routes>
   </MemoryRouter>
  );
  screen.debug();
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
