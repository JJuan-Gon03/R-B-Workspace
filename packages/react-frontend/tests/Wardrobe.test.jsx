import {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
} from "@testing-library/react";
import { vi } from "vitest";
import Wardrobe from "../src/Wardrobe";

vi.mock("../src/Upload2.jsx", () => ({
  default: () => <div data-testid="upload2-mock" />,
}));

const MOCK_DATA = [
  { img_url: "shirt1.png", type: "Shirts" },
  { img_url: "shirt2.png", type: " shirts " },
  { img_url: "pants1.png", type: "Pants" },
  { img_url: "jacket1.png", type: "JACKETS" },
];

function mockFetchOk(data) {
  vi.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: true,
    json: async () => data,
  });
}

function mockFetchNotOk() {
  vi.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: false,
    json: async () => ({ message: "Bad request" }),
  });
}

function mockFetchReject() {
  vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Network fail"));
}

describe("Wardrobe - 100% coverage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test("loads and shows all items (All category)", async () => {
    mockFetchOk(MOCK_DATA);

    render(<Wardrobe />);

    await waitFor(() =>
      expect(screen.getByText("4 items")).toBeInTheDocument()
    );

    expect(screen.getAllByRole("img")).toHaveLength(4);
    expect(screen.getByTestId("upload2-mock")).toBeInTheDocument();
  });

  test("filters by category (case + trim normalization)", async () => {
    mockFetchOk(MOCK_DATA);
    render(<Wardrobe />);

    await waitFor(() =>
      expect(screen.getByText("4 items")).toBeInTheDocument()
    );

    fireEvent.click(screen.getAllByRole("button", { name: "Shirts" })[0]);

    await waitFor(() =>
      expect(screen.getByText("2 items")).toBeInTheDocument()
    );

    expect(screen.getAllByRole("img")).toHaveLength(2);
  });

  test("selection toggles on and off", async () => {
    mockFetchOk(MOCK_DATA);
    render(<Wardrobe />);

    await waitFor(() =>
      expect(screen.getByText("4 items")).toBeInTheDocument()
    );

    const firstImg = screen.getAllByRole("img")[0];
    const sellBtn = screen.getByRole("button", { name: "Sell" });

    expect(sellBtn).toBeDisabled();

    fireEvent.click(firstImg);
    expect(sellBtn).not.toBeDisabled();

    fireEvent.click(firstImg);
    expect(sellBtn).toBeDisabled();
  });

  test("selection resets if filtered out", async () => {
    mockFetchOk(MOCK_DATA);
    render(<Wardrobe />);

    await waitFor(() =>
      expect(screen.getByText("4 items")).toBeInTheDocument()
    );

    const pantsImg = screen
      .getAllByRole("img")
      .find((img) => img.getAttribute("src") === "pants1.png");

    fireEvent.click(pantsImg);

    const sellBtn = screen.getByRole("button", { name: "Sell" });
    expect(sellBtn).not.toBeDisabled();

    fireEvent.click(screen.getAllByRole("button", { name: "Shirts" })[0]);

    await waitFor(() =>
      expect(screen.getByText("2 items")).toBeInTheDocument()
    );

    expect(sellBtn).toBeDisabled();
  });

  test("handles non-ok fetch response", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    mockFetchNotOk();

    render(<Wardrobe />);

    await waitFor(() => expect(consoleSpy).toHaveBeenCalled());
  });

  test("handles fetch rejection (catch block)", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    mockFetchReject();

    render(<Wardrobe />);

    await waitFor(() => expect(consoleSpy).toHaveBeenCalled());
  });

  test("cleanup restores body styles on unmount", async () => {
    mockFetchOk(MOCK_DATA);
    const { unmount } = render(<Wardrobe />);

    await waitFor(() =>
      expect(screen.getByText("4 items")).toBeInTheDocument()
    );

    unmount();

    expect(document.body.style.overflow).toBe("");
    expect(document.body.style.overscrollBehavior).toBe("");
  });
  test("clicks every category button in the category strip (covers onClick at line 112)", async () => {
    mockFetchOk(MOCK_DATA);
    render(<Wardrobe />);

    await waitFor(() => expect(screen.getByText(/items/i)).toBeInTheDocument());

    const allButtons = screen.getAllByRole("button", { name: "All" });

    const targetAllButton = allButtons[allButtons.length - 1];

    const categoryContainer = targetAllButton.parentElement;
    const scoped = within(categoryContainer);

    const buttons = scoped.getAllByRole("button");
    buttons.forEach((btn) => fireEvent.click(btn));

    expect(screen.getByText(/items/i)).toBeInTheDocument();
  });
});
