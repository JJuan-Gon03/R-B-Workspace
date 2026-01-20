import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Assistant from "../Assistant";
import { vi } from "vitest";

const hoodie_img =
  "https://hourscollection.com/cdn/shop/files/DropShoulderHoodie-Grey-productphoto_1_1000x.png?v=1762197948";
const sweatpant_img =
  "https://hourscollection.com/cdn/shop/files/ClassicSweatpants-Grey_1600x.png?v=1762198113";

beforeEach(() => {
  vi.restoreAllMocks();
});

test("open chat, send message, recieve message w/o images", async () => {
  vi.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: true,
    json: async () => ({ text: "hi" }),
  });

  render(<Assistant />);

  fireEvent.click(screen.getByText("AI"));

  fireEvent.change(screen.getByPlaceholderText("Send a message..."), {
    target: { value: "hello" },
  });
  fireEvent.click(screen.getByRole("button", { name: /send/i }));
  expect(screen.getByText("hello")).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText("hi")).toBeInTheDocument();
  });
});

test("open chat, send message, recieve message w/ images", async () => {
  vi.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      ok: true,
      text: "hi",
      imgs: [hoodie_img, sweatpant_img],
    }),
  });

  render(<Assistant />);

  fireEvent.click(screen.getByText("AI"));

  fireEvent.change(screen.getByPlaceholderText("Send a message..."), {
    target: { value: "hello" },
  });
  fireEvent.click(screen.getByRole("button", { name: /send/i }));
  expect(screen.getByText("hello")).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText("hi")).toBeInTheDocument();
  });

  const imgs = document.querySelectorAll("img");
  expect(imgs.length).toBe(2);
});

test("server error", async () => {
  vi.spyOn(global, "fetch").mockResolvedValueOnce({
    json: async () => ({ ok: false }),
  });

  render(<Assistant />);

  fireEvent.click(screen.getByText("AI"));

  fireEvent.change(screen.getByPlaceholderText("Send a message..."), {
    target: { value: "hello" },
  });
  fireEvent.click(screen.getByRole("button", { name: /send/i }));
  expect(screen.getByText("hello")).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText("servers down")).toBeInTheDocument();
  });
});
