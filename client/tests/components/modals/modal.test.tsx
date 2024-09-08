import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Modal from "../../../src/components/Modal/modal";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
// import socketService from "../../../src/services/socketServices";
import { socket } from "../../../src/services/socketServices";
import { Socket } from "socket.io-client";

const user = userEvent.setup();

const toggleModalMock = vi.fn();
const setLobbyIdMock = vi.fn();
const setMembersMock = vi.fn();

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
          if (event === "join_lobby") {
            callback({
              success: true,
              confirmedLobbyId: "1234",
              error: "",
              lobbyMembers: ["test_user1", "test_user2"],
            });
          }
        }),
      },
    };
  }
);

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
          setMembers={setMembersMock}
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
          setMembers={setMembersMock}
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
          setMembers={setMembersMock}
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
          setMembers={setMembersMock}
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
          userId={"test_user1"}
          setLobbyId={setLobbyIdMock}
          toggleModal={toggleModalMock}
          setMembers={setMembersMock}
        />
      </MemoryRouter>
    );
    const input = screen.getByRole("textbox");
    const joinLobbyBtn = screen.getByRole("button", { name: "Join Lobby" });

    await user.type(input, "1234");
    await user.click(joinLobbyBtn);

    expect(setLobbyIdMock).toHaveBeenCalledWith("1234");
  });

  test.todo("clicking on 'Join Lobby' navigates the user to the Lobby page");
});
