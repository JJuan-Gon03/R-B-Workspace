import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Assistant from "../src/Assistant";
import { vi } from "vitest";

const hoodie_img =
  "https://hourscollection.com/cdn/shop/files/DropShoulderHoodie-Grey-productphoto_1_1000x.png?v=1762197948";
const sweatpant_img =
  "https://hourscollection.com/cdn/shop/files/ClassicSweatpants-Grey_1600x.png?v=1762198113";

test("opening chat", async () => {
  render(<Assistant />);
  fireEvent.click(screen.getByText("AI"));

  expect(screen.getByText("AI Assistant")).toBeInTheDocument();
});

test("sending a message", async () => {
  render(<Assistant />);
  fireEvent.click(screen.getByText("AI"));
  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: "hello!" },
  });
  fireEvent.click(screen.getByText("Send"));

  expect(screen.getByRole("textbox")).toHaveValue("");
  expect(screen.getByText("hello!")).toBeInTheDocument();
});

test("recieving a message", async () => {
  vi.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    json: async () => ({ text: "hi! how can i help you?" }),
  });

  render(<Assistant />);
  fireEvent.click(screen.getByText("AI"));
  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: "hello!" },
  });
  fireEvent.click(screen.getByText("Send"));

  await waitFor(()=>{
    expect(screen.getByText("hi! how can i help you?")).toBeInTheDocument();
  })
});

test("recieving a message with images", async () => {
  vi.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    json: async () => ({ text: "hi! how can i help you?", imgs: [hoodie_img,sweatpant_img]}),
  });

  render(<Assistant />);
  fireEvent.click(screen.getByText("AI"));
  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: "hello!" },
  });
  fireEvent.click(screen.getByText("Send"));

  await waitFor(()=>{
    expect(screen.getByText("hi! how can i help you?")).toBeInTheDocument();
    
    const imgs = document.querySelectorAll("img");
    expect(imgs.length).toBe(2);
  })
});
