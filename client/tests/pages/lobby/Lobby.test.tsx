import Lobby from "../../../src/pages/Lobby/Lobby";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import { socket } from "../../../src/services/socketServices";
import { MemoryRouter } from "react-router-dom";

const lobbyIdMock = "1234"
const userIdMock = "John"
const setMembersMock = vi.fn();
const setNotificationsMock = vi.fn();

describe("Lobby:", () => {
    it("should render correct elements", () => {
        render(
            <MemoryRouter>
                <Lobby lobbyId = {lobbyIdMock} socket={socket} userId={userIdMock} members = {[]} setMembers = {setMembersMock} notifications = {[]} setNotifications={setNotificationsMock}/>
            </MemoryRouter>
        )

        const lobbyId = screen.getByText(/1234/);
        expect(lobbyId).toBeVisible(); 

    })
})