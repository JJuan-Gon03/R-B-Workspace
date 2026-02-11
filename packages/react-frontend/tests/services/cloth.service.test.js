import { vi } from "vitest";
import { deleteCloth } from "../../src/services/cloth.service";

test("successful delete", async () => {
  vi.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: true,
  });

  await deleteCloth(123);

  expect(global.fetch).toHaveBeenCalledWith(
    "http://localhost:8000/wardrobe/" + encodeURIComponent(123),
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
