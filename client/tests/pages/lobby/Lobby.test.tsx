import Lobby from "../../../src/pages/Lobby/Lobby";
import { describe, it, expect, vi, test, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import React from "react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { socket } from "../../../src/services/socketServices";
import { Socket } from "socket.io-client";

const lobbyIdMock = "1234";
const setMembersMock = vi.fn();
const setNotificationsMock = vi.fn();
const membersArrayMock = ["testUser1", "testUser2"];
const user = userEvent.setup();

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
        emit: vi.fn(),
      },
    };
  }
);

describe("Lobby:", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render correct elements", () => {
    render(
      <MemoryRouter>
        <Lobby
          socket={socket}
          lobbyId={lobbyIdMock}
          userId={"testUser1"}
          members={membersArrayMock}
          setMembers={setMembersMock}
          notifications={[""]}
          setNotifications={setNotificationsMock}
        />
      </MemoryRouter>
    );

    const lobbyId = screen.getByText("Lobby: 1234");
    const memberList = screen.getByRole("list", { name: "members-list" });
    const memberItem = memberList.querySelectorAll(".member-item");
    expect(lobbyId).toBeVisible();
    expect(memberItem).toHaveLength(2);
    expect(memberItem[0]).toHaveTextContent(membersArrayMock[0]);
    expect(memberItem[1]).toHaveTextContent(membersArrayMock[1]);
  });

  test("clicking on 'start game' should emit 'start_game' event if there are more than 1 player", async () => {
    render(
      <MemoryRouter>
        <Lobby
          socket={socket}
          lobbyId={lobbyIdMock}
          userId={"testUser1"}
          members={membersArrayMock}
          setMembers={setMembersMock}
          notifications={[""]}
          setNotifications={setNotificationsMock}
        />
      </MemoryRouter>
    );

    const startGameBtn = screen.getByRole("button", { name: "Start Game" });
    expect(startGameBtn).toBeVisible();

    await user.click(startGameBtn);

    expect(socket.emit).toHaveBeenCalledWith("start_game", {
      lobbyId: lobbyIdMock,
      members: [membersArrayMock[0], membersArrayMock[1]],
    });
  });

  test("clicking on 'Start Game' shouldn't emit 'start_game' if there are less than 2 players and show an error notification", async () => {
    render(
      <MemoryRouter>
        <Lobby
          socket={socket}
          lobbyId={lobbyIdMock}
          userId={"testUser1"}
          members={["testUser1"]}
          setMembers={setMembersMock}
          notifications={[""]}
          setNotifications={setNotificationsMock}
        />
      </MemoryRouter>
    );

    const startGameBtn = screen.getByRole("button", { name: "Start Game" });
    expect(startGameBtn).toBeVisible();
    
    await user.click(startGameBtn);

    expect(socket.emit).not.toHaveBeenCalled();
  });

  test("clicking on 'Start Game', shouldn't emit 'start_game' if there are more than 5 players", async () => {
    render(
      <MemoryRouter>
        <Lobby
          socket={socket}
          lobbyId={lobbyIdMock}
          userId={"testUser1"}
          members={[
            "testUser1",
            "testUser2",
            "testUser3",
            "testUser4",
            "testUser5",
            "testUser6",
          ]}
          setMembers={setMembersMock}
          notifications={[""]}
          setNotifications={setNotificationsMock}
        />
      </MemoryRouter>
    );

    const startGameBtn = screen.getByRole("button", { name: "Start Game" });
    expect(startGameBtn).toBeVisible();

    await user.click(startGameBtn);

    expect(socket.emit).not.toHaveBeenCalled();
  });
  test.todo("clicking on 'Leave Lobby' should navigate back to home page");
});
