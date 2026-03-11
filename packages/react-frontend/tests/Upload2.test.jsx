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

function openForm() {
  render(<Upload2 setClothes={vi.fn()} />);
  fireEvent.click(screen.getByText("Upload Item"));
}

function uploadFile(container, type = "image/png", size = 100) {
  const fileInput = container.querySelector('input[type="file"]');
  const file = new File(["x".repeat(size)], "img.png", { type });
  Object.defineProperty(file, "size", { value: size });
  fireEvent.change(fileInput, { target: { files: [file] } });
  return file;
}

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

test("close button dismisses the form", () => {
  openForm();
  expect(screen.getByTestId("child-mock")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "✕" }));
  expect(screen.getByText("Upload Item")).toBeInTheDocument();
});

test("handleFile rejects invalid file type", () => {
  global.URL.createObjectURL = vi.fn();
  const { container } = render(<Upload2 setClothes={vi.fn()} />);
  fireEvent.click(screen.getByText("Upload Item"));
  uploadFile(container, "application/pdf");
  expect(
    screen.getByText("Please upload a JPEG, PNG, or WebP image.")
  ).toBeInTheDocument();
  expect(screen.queryByAltText("preview")).not.toBeInTheDocument();
});

test("handleFile rejects files over 2MB", () => {
  global.URL.createObjectURL = vi.fn();
  const { container } = render(<Upload2 setClothes={vi.fn()} />);
  fireEvent.click(screen.getByText("Upload Item"));
  uploadFile(container, "image/png", 3 * 1024 * 1024);
  expect(screen.getByText("Image must be under 2MB.")).toBeInTheDocument();
  expect(screen.queryByAltText("preview")).not.toBeInTheDocument();
});

test("submitting without required fields shows validation error", () => {
  openForm();
  fireEvent.click(screen.getByRole("button", { name: /upload/i }));
  expect(
    screen.getByText("Please fill in all required fields and add an image.")
  ).toBeInTheDocument();
});

test("submit with server error shows error message", async () => {
  global.URL.createObjectURL = vi.fn(() => "blob:url");
  vi.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: false,
    json: async () => ({ message: "Server error" }),
  });

  const { container } = render(<Upload2 setClothes={vi.fn()} />);
  fireEvent.click(screen.getByText("Upload Item"));

  fireEvent.change(screen.getByLabelText("Item Name *"), {
    target: { value: "Jacket" },
  });
  fireEvent.change(screen.getByLabelText("Color *"), {
    target: { value: "Blue" },
  });
  fireEvent.change(screen.getByLabelText("Type *"), {
    target: { value: "Jackets" },
  });
  uploadFile(container, "image/png");

  fireEvent.click(screen.getByRole("button", { name: /upload/i }));

  await waitFor(() => {
    expect(screen.getByText("Server error")).toBeInTheDocument();
  });
});

test("Clear All opens confirm modal, No closes it", () => {
  openForm();
  fireEvent.click(screen.getByText("Clear All"));
  expect(
    screen.getByText("Are you sure you want to clear everything?")
  ).toBeInTheDocument();
  fireEvent.click(screen.getByText("No"));
  expect(
    screen.queryByText("Are you sure you want to clear everything?")
  ).not.toBeInTheDocument();
});

test("Clear All then Yes, Clear resets the form", () => {
  global.URL.createObjectURL = vi.fn(() => "blob:url");
  const { container } = render(<Upload2 setClothes={vi.fn()} />);
  fireEvent.click(screen.getByText("Upload Item"));

  fireEvent.change(screen.getByLabelText("Item Name *"), {
    target: { value: "Hat" },
  });
  uploadFile(container, "image/png");

  fireEvent.click(screen.getByText("Clear All"));
  expect(
    screen.getByText("Are you sure you want to clear everything?")
  ).toBeInTheDocument();

  fireEvent.click(screen.getByText("Yes, Clear"));
  expect(
    screen.queryByText("Are you sure you want to clear everything?")
  ).not.toBeInTheDocument();
  expect(screen.getByLabelText("Item Name *")).toHaveValue("");
});

test("remove image preview clears the image", () => {
  global.URL.createObjectURL = vi.fn(() => "blob:preview");
  global.URL.revokeObjectURL = vi.fn();
  const { container } = render(<Upload2 setClothes={vi.fn()} />);
  fireEvent.click(screen.getByText("Upload Item"));
  uploadFile(container, "image/png");
  expect(screen.getByAltText("preview")).toBeInTheDocument();
  fireEvent.click(container.querySelector(".upload-image-remove"));
  expect(screen.queryByAltText("preview")).not.toBeInTheDocument();
});
