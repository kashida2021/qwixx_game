import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
//import { userEvent } from "@testing-library/user-event";
import React from "react";
import GamePage from "../../src/pages/GamePage/GamePage";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { socket } from "../../src/services/socketServices";

//const user = userEvent.setup();

const lobbyIdMock = "1234";
const membersArrayMock = ["testUser1", "testUser2"];

describe("Game Page Unit Test:", () => {
 it("renders the page", () => {
  render(
   <MemoryRouter>
    <GamePage
     socket={socket}
     userId={"test user 1"}
     members={membersArrayMock}
     lobbyId={lobbyIdMock}
    />
   </MemoryRouter>
  );

  const h1 = screen.getByRole("heading", {level: 1});
  const redRow = screen.getByRole("list", { name: "row-red" });
  const buttons = within(redRow).getAllByRole("button");
    


  expect(h1).toHaveTextContent(`Lobby: ${lobbyIdMock}`);
  expect(redRow).toBeVisible();
  expect(buttons).toHaveLength(12);
    });
});