import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddTagButton from "../src/tags/AddTagButton";
import { vi } from "vitest";

test("basic functionality",async()=>{
    vi.spyOn(global,"fetch").mockResolvedValue({
        ok: true,
        json: async() => ({message: "error"})
    })

    render(<AddTagButton setUnselectedTags={vi.fn()} setSearchPrefix={vi.fn()}/>)

    fireEvent.click(screen.getByRole("button"))

    const textbox=screen.getByRole("textbox")
    fireEvent.change(textbox,{
        target: {value: "test tag"}
    })
    fireEvent.keyDown(textbox, { key: 'Enter', code: 'Enter', charCode: 13 });


    await waitFor(() => {
        expect(screen.getByRole("button")).toBeInTheDocument();
    });
})

test("basic error",async()=>{
    vi.spyOn(global,"fetch").mockResolvedValue({
        ok: false,
        json: async() => ({message: "error"})
    })

    render(<AddTagButton setUnselectedTags={vi.fn()}/>)

    fireEvent.click(screen.getByRole("button"))

    const textbox=screen.getByRole("textbox")
    fireEvent.change(textbox,{
        target: {value: "test tag"}
    })
    fireEvent.keyDown(textbox, { key: 'Enter', code: 'Enter', charCode: 13 });

    await waitFor(() => {
        expect(screen.getByRole("textbox")).toBeInTheDocument();
    });
})