import Lobby from "../../../src/pages/Lobby/Lobby";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";

const lobbyIdMock = "1234"

describe("Lobby:", () => {
    it("should render correct elements", () => {
        render(<Lobby lobbyId = {lobbyIdMock}/>)

        const lobbyId = screen.getByText("1234");
        expect(lobbyId).toBeVisible(); 

    })
})