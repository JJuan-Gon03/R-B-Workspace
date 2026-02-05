import { jest } from "@jest/globals";

const mockMain = jest.fn();

jest.unstable_mockModule("../../../src/services/gemini.service.js", () => ({
  main: mockMain,
}));

const { getGeminiResponse } = await import(
  "../../../src/controllers/gemini.controller.js"
);

function makeRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };
}

test("getGeminiResponse -> main error", async () => {
  mockMain.mockRejectedValueOnce(new Error("error"));

  const req = { params: { text: "text", user_id: 123 } };
  const res = makeRes();

  await getGeminiResponse(req, res);

  expect(mockMain).toHaveBeenCalledWith(req.params.text, req.params.user_id);
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({
    message: "error retrieving response",
  });
});

test("getGeminiResponse -> main success -> return success", async () => {
  const reply = "reply";
  mockMain.mockReturnValueOnce(reply);

  const req = { params: { text: "text", user_id: 123 } };
  const res = makeRes();

  await getGeminiResponse(req, res);

  expect(mockMain).toHaveBeenCalledWith(req.params.text, req.params.user_id);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(reply);
});
