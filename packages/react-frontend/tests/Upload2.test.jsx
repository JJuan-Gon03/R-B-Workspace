import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("../src/services/cloudinary.js", async () => ({
  default: {
    getImgURL: vi.fn(async () => ({
      img_url: "exampleurl.com",
      public_id: "abc",
    })),
  },
}));

vi.mock("../src/tags/TagsBox", () => ({
  default: () => <div data-testid="child-mock" />,
}));

vi.spyOn(global, "fetch").mockResolvedValue({
  ok: true,
  json: async () => ({}),
});

import Upload2 from "../src/Upload2";

test("basic functionality", async () => {
  global.URL.createObjectURL = vi.fn(() => "blob:preview-url");

  const { container } = render(<Upload2 setClothes={vi.fn()} />);

  fireEvent.click(screen.getByText("Upload Item"));

  expect(screen.getByTestId("child-mock")).toBeInTheDocument();

  const select_name = screen.getByLabelText("Item Name *");
  fireEvent.change(select_name, {
    target: { value: "example name" },
  });
  expect(select_name).toHaveValue("example name");

  const select_color = screen.getByLabelText("Color *");
  fireEvent.change(select_color, { target: { value: "Black" } });
  expect(select_color).toHaveValue("Black");

  const select_type = screen.getByLabelText("Type *");
  fireEvent.change(select_type, { target: { value: "Shirts" } });
  expect(select_type).toHaveValue("Shirts");

  const fileInput = container.querySelector('input[type="file"]');
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
    expect(screen.getByText("Upload Item")).toBeInTheDocument();
  });
});
