import { render, screen } from "@testing-library/react";
import About from "../src/About";

test("renders About page", () => {
  render(<About />);
  expect(screen.getByText("About THRIFTR")).toBeInTheDocument();
});
