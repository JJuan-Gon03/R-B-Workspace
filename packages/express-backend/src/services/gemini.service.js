import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { getClothesByUserId } from "./cloth.service.js";
import { getTags } from "./tag.service.js";

const replySchema = z.object({
  text: z.string().describe("Your text response to the User goes here."),
  imgs: z
    .array(z.string().url())
    .optional()
    .describe(
      "If the reply includes picking out clothing items from the User's wardrobe, include any wardrobe item's image url here."
    ),
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
let chat = null;

async function main(prompt, user_id) {
  if (!chat) {
    const wardrobe = await getClothesByUserId(user_id);
    const tgs = await getTags(user_id);
    chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: `You are an AI assistant with access to a user's wardrobe: ${wardrobe}. Wardrobe items have tag ids that are associated with tag objects: ${tgs}`,
        responseMimeType: "application/json",
        responseJsonSchema: zodToJsonSchema(replySchema),
      },
    });
  }

  const response = await chat.sendMessage({ message: prompt });
  const reply = replySchema.parse(JSON.parse(response.text));
  return reply;
}

async function parse_cloth(img_url) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Generate a description of the clothing item at this url ${img_url}.
               Only respond with the description of the clothing item.
               IMPORTANT: If there is no url or there is anything else except a SINGLE CLOTHING/CLOTHING ACCESSORY item (NO HUMANS ALLOWED), return this text EXACTLY: INVALID`,
    config: { tools: [{ urlContext: {} }] },
  });
  return response.text;
}

function resetChat() {
  chat = null;
}

export { main, parse_cloth, resetChat };
