import { describe, test, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import React from "react";
import Home from "../../../src/pages/HomePage/HomePage";
import Lobby from "../../../src/pages/Lobby/Lobby";
import "@testing-library/jest-dom";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { socket } from "../../../src/services/socketServices";
import { Socket } from "socket.io-client";

type SocketServiceModule = {
  socket: Socket;
};

vi.mock(
  "../../../src/services/socketServices",
  async (importOriginal: () => Promise<SocketServiceModule>) => {
    const actual = await importOriginal();
    return {
      ...actual,
      socket: {
        ...actual.socket,
        emit: vi.fn((event, data, callback) => {
          if (event === "create_lobby") {
            callback("1234");
          } else if (event === "join_lobby") {
            callback({ success: true, confirmedLobbyId: "1234", error: "" });
          }
        }),
      },
    };
  }
);

const user = userEvent.setup();
const setLobbyIdMock = vi.fn();
const setUserIdMock = vi.fn();
const setMembersMock = vi.fn();
const setNotificationsMock = vi.fn();

describe("HomePage Intergation tests:", () => {
  test("Creating a lobby navigates to lobby page'", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                socket={socket}
                isConnected={true}
                setLobbyId={setLobbyIdMock}
                userId={"test_user"}
                setUserId={setUserIdMock}
                setMembers={setMembersMock}
              />
            }
          />
          <Route
            path="/lobby/:lobbyId"
            element={
              <Lobby
                socket={socket}
                lobbyId={""}
                userId={"test_user"}
                members={["test_user"]}
                setMembers={setMembersMock}
                notifications={[]}
                setNotifications={setNotificationsMock}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    );

    const btnCreateLobby = screen.getByRole("button", { name: "Create Lobby" });

    await user.click(btnCreateLobby);

    await waitFor(() => {
      const headings = screen.getAllByRole("heading");
      expect(setLobbyIdMock).toBeCalledWith("1234");
      headings.forEach((heading) => {
        expect(heading).toBeVisible();
      });
    });
  });

  test("'Join Lobby' modal can pop up and close", async () => {
    render(
      <MemoryRouter>
        <Home
          socket={socket}
          isConnected={true}
          setLobbyId={setLobbyIdMock}
          userId={""}
          setUserId={setUserIdMock}
          setMembers={setMembersMock}
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

  test("Joining a lobby navigates to lobby page", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                socket={socket}
                isConnected={true}
                setLobbyId={setLobbyIdMock}
                userId={"test_user2"}
                setUserId={setUserIdMock}
                setMembers={setMembersMock}
              />
            }
          />
          <Route
            path="/lobby/:lobbyid"
            element={
              <Lobby
                socket={socket}
                lobbyId={""}
                userId={"test_user"}
                members={["test_user1", "test_user2"]}
                setMembers={setMembersMock}
                notifications={[]}
                setNotifications={setNotificationsMock}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    );
    const joinLobbyBtn1 = screen.getByRole("button", { name: "Join Lobby" });

    await user.click(joinLobbyBtn1);

    const input = screen.getAllByRole("textbox")[1];
    const joinLobbyBtn2 = screen.getAllByRole("button", {
      name: "Join Lobby",
    })[1];

    await user.type(input, "1234");
    await user.click(joinLobbyBtn2);

    const headings = screen.getAllByRole("heading");
    headings.forEach((heading) => {
      expect(heading).toBeVisible();
    });
  });
});
