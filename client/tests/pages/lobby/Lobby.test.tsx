import Lobby from "../../../src/pages/Lobby/Lobby";
import { describe, it, expect, vi } from "vitest";
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
    render(
      <MemoryRouter>
        <Lobby
          socket={socket}
          lobbyId={lobbyIdMock}
          userId={"test-user"}
          members={["test-user"]}
          setMembers={setMembersMock}
          notifications={[""]}
          setNotifications={setNotificationsMock}
        />
      </MemoryRouter>
    );

    const lobbyId = screen.getByText("Lobby: 1234");
    expect(lobbyId).toBeVisible();
  });
});
