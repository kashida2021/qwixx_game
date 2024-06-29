import Lobby from "../../../src/pages/Lobby/Lobby";
import { describe, it, expect, vi, test } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { socket } from "../../../src/services/socketServices";
import { MemoryRouter } from "react-router-dom";

const lobbyIdMock = "1234"
const userIdMock = "John"
const setMembersMock = vi.fn();
const setNotificationsMock = vi.fn();
const membersArrayMock = ["testUser 1", "testUser 2"];

describe("Lobby:", () => {
    it("should render correct elements", () => {
        render(
            <MemoryRouter>
                <Lobby lobbyId = {lobbyIdMock} socket={socket} userId={userIdMock} members = {[]} setMembers = {setMembersMock} notifications = {[]} setNotifications={setNotificationsMock}/>
            </MemoryRouter>
        )

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
