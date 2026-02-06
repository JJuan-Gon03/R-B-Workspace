import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import TagBox from "../src/tags/TagsBox";
import { vi } from "vitest";

vi.mock("../src/tags/AddTagButton", () => ({
  default: () => <div />,
}));

test("renders correctly", async () => {
  vi.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: true,
    json: async () => [
      { _id: 1, user_id: 123, name: "tag1" },
      { _id: 2, user_id: 123, name: "tag2" },
    ],
  });

  render(
    <TagBox selectedTags={[]} setSelectedTags={vi.fn()} refreshTrigger={[]} />
  );

  const bottomSection = screen.getByRole("separator").nextSibling;

  const tag1 = await within(bottomSection).findByText("tag1");
  const tag2 = await within(bottomSection).findByText("tag2");

  expect(tag1).toBeInTheDocument();
  expect(tag2).toBeInTheDocument();
});

test("remove from unselected tags", async () => {
  vi.spyOn(global, "fetch")
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [{ _id: 1, user_id: 123, name: "tag1" }],
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

  render(
    <TagBox selectedTags={[]} setSelectedTags={vi.fn()} refreshTrigger={[]} />
  );

  fireEvent.click(await screen.findByText("x"));

  await waitFor(() => {
    expect(screen.queryByText("tag1")).toBeNull();
  });
});

test("add to selected tags", async () => {
  vi.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: true,
    json: async () => [{ _id: 1, user_id: 123, name: "tag1" }],
  });

  let selectedTags = [];
  function setSelectedTags(next) {
    if (typeof next === "function") {
      selectedTags = next(selectedTags);
    } else {
      selectedTags = next;
    }
  }

  render(
    <TagBox
      selectedTags={selectedTags}
      setSelectedTags={setSelectedTags}
      refreshTrigger={[]}
    />
  );

  const bottomSection = screen.getByRole("separator").nextSibling;
  const tag1 = await within(bottomSection).findByText("tag1");
  fireEvent.click(tag1);

  await waitFor(() => {
    expect(selectedTags).toEqual([{ _id: 1, user_id: 123, name: "tag1" }]);
  });
});
