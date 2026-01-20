import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("../cloudinary.js", () => ({
  default: {
    getImgURL: vi.fn(async () => "exampleurl.com"),
  },
}));

import Upload2 from "../Upload2";

test("basic functionality", async () => {
  vi.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      ok: false,
    }),
  });

  global.URL.createObjectURL = vi.fn(() => "blob:preview-url");

  render(<Upload2 setClothes={vi.fn()} />);

  fireEvent.click(screen.getByText("Upload Item"));

  const select_name = screen.getByPlaceholderText("Name");

  fireEvent.change(select_name, {
    target: { value: "example name" },
  });

  expect(select_name).toHaveValue("example name");

  const select_color = screen.getByLabelText("color-select");
  fireEvent.change(select_color, { target: { value: "Black" } });
  expect(select_color).toHaveValue("Black");

  const select_type = screen.getByLabelText("type-select");
  fireEvent.change(select_type, { target: { value: "Shirts" } });
  expect(select_type).toHaveValue("Shirts");

  const fileInput = screen.getByLabelText("file-select");
  const file = new File(["image"], "shirt.png", {
    type: "image/png",
  });

  fireEvent.change(fileInput, {
    target: { files: [file] },
  });

  const preview = screen.getByAltText("preview");
  expect(preview).toBeInTheDocument();
  expect(preview).toHaveAttribute("src", "blob:preview-url");

  fireEvent.click(screen.getByRole("button", { name: /upload/i }));

  await waitFor(() => {
    expect(screen.getByText("Upload successful")).toBeInTheDocument();
    expect(select_name).toHaveValue("");
    expect(select_color).toHaveValue("");
    expect(select_type).toHaveValue("");
  });
});

test("error", async () => {
  vi.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: false,
    json: async () => ({
      ok: false,
    }),
  });
  global.URL.createObjectURL = vi.fn(() => "blob:preview-url");

  render(<Upload2 setClothes={vi.fn()} />);

  fireEvent.click(screen.getByText("Upload Item"));
  fireEvent.change(screen.getByPlaceholderText("Name"), {
    target: { value: "example name" },
  });

  const select_color = screen.getByLabelText("color-select");
  fireEvent.change(select_color, { target: { value: "Black" } });
  expect(select_color).toHaveValue("Black");

  const select_type = screen.getByLabelText("type-select");
  fireEvent.change(select_type, { target: { value: "Shirts" } });
  expect(select_type).toHaveValue("Shirts");

  const fileInput = screen.getByLabelText("file-select");
  const file = new File(["image"], "shirt.png", {
    type: "image/png",
  });

  fireEvent.change(fileInput, {
    target: { files: [file] },
  });

  fireEvent.click(screen.getByRole("button", { name: /upload/i }));

  await waitFor(() => {
    expect(screen.getByText("Upload failed")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /try again/i })
    ).toBeInTheDocument();
  });
});
