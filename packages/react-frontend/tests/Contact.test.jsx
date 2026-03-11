import { render, screen } from "@testing-library/react";
import Contact from "../src/Contact";

test("renders Contact page", () => {
  render(<Contact />);
  expect(screen.getByText("Contact Us")).toBeInTheDocument();
});
