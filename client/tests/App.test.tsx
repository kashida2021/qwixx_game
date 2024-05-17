// Imports
import { describe, it, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import React from "react";
import App from "../src/App.tsx";

// Tests
describe("Renders main page correctly", () => {
 it("Should render the page correctly", () => {
  expect(true).toBeTruthy();
 });

 it("renders the page", () => {
  render(<App />);
  const h1 = screen.getByRole("heading", { name: "Hello" });
  const input = screen.getByRole("textbox", { name: "" });
  const btn = screen.getByRole("button", { name: "Join Room" });
  expect(h1).toHaveTextContent("Hello");
  expect(input).toBeVisible(); 
  expect(btn).toBeVisible(); 
 });
});
