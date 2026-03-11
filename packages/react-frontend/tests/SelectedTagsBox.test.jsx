import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import SelectedTagsBox from "../src/tags/SelectedTagsBox";

test("shows empty hint when no tags are selected", () => {
  render(
    <SelectedTagsBox
      selectedTags={[]}
      setSelectedTags={vi.fn()}
      setUnselectedTags={vi.fn()}
    />
  );

  expect(screen.getByText(/No tags selected/)).toBeInTheDocument();
});

test("renders selected tags and removes one when × is clicked", () => {
  const mockSetSelected = vi.fn();
  const mockSetUnselected = vi.fn();
  const tags = [{ _id: "1", name: "casual" }];

  render(
    <SelectedTagsBox
      selectedTags={tags}
      setSelectedTags={mockSetSelected}
      setUnselectedTags={mockSetUnselected}
    />
  );

  expect(screen.getByText("casual")).toBeInTheDocument();

  fireEvent.click(screen.getByTitle("Remove from selection"));

  expect(mockSetSelected).toHaveBeenCalled();
  expect(mockSetUnselected).toHaveBeenCalled();
});
