import Lobby from "../../../src/pages/Lobby/Lobby";
import { describe, it, expect, vi, test } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { socket } from "../../../src/services/socketServices";

const lobbyIdMock = "1234";
const setMembersMock = vi.fn();
const setNotificationsMock = vi.fn();

describe("Lobby:", () => {
  it("should render correct elements", () => {
    const membersArrayMock = ["testUser1", "testUser2"];

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

  test.todo("clicking on 'start game' should navigate to game page");
  test.todo("clicking on 'Leave Lobby' should navigate back to home page");
});
