import { vi } from "vitest";
import { deleteCloth } from "../../src/services/cloth.service";

test("successful delete", async () => {
  vi.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: true,
  });

  await deleteCloth(123);

  expect(global.fetch).toHaveBeenCalledWith(
    expect.stringContaining("/wardrobe/123"),
    { method: "DELETE" }
  );
});

test("delete error", async () => {
  vi.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: false,
    json: async () => ({ message: "an error has occured" }),
  });

  await expect(deleteCloth(123)).rejects.toThrow("an error has occured");
});

test("delete error with no message falls back to default", async () => {
  vi.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: false,
    json: async () => ({}),
  });

  await expect(deleteCloth(123)).rejects.toThrow("Cloth Delete Failed");
});
