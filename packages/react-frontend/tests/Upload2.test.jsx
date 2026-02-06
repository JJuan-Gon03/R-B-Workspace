import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("../src/servicescloudinary.js", async () => ({
  default: {
    getImgURL: vi.fn(async () => "exampleurl.com"),
  },
}));

vi.mock('../src/tags/TagsBox', () => ({
  default: () => <div data-testid="child-mock" />
}));

vi.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    json: async () => ({}),
});

import Upload2 from "../src/Upload2";

test("basic functionality", async () => {
  
  global.URL.createObjectURL = vi.fn(() => "blob:preview-url");

  render(<Upload2 setClothes={vi.fn()} />);

  fireEvent.click(screen.getByText("Upload Item"));

  expect(screen.getByTestId('child-mock')).toBeInTheDocument();

  const select_name = screen.getByLabelText("name-select");

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

  const preview = screen.getByLabelText("preview");
  expect(preview).toBeInTheDocument();
  expect(preview).toHaveAttribute("src", "blob:preview-url");

  fireEvent.click(screen.getByRole("button", { name: /upload/i }));

  expect(screen.getByText(/uploading…/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByLabelText("name-select")).toHaveValue("");
    expect(select_color).toHaveValue("");
    expect(select_type).toHaveValue("");
  });
});