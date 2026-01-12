import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import wardrobe from "./wardrobe.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
let chat = null;

const replySchema = z.object({
  text: z.string().describe("Your text response to the User goes here."),
  imgs: z
    .array(z.string().url())
    .optional()
    .describe(
      "If the reply includes picking out clothing items from the User's wardrobe, include any wardrobe item's image url here."
    ),
});

async function main(prompt, user_id) {
  if (!chat) {
    const wd = await wardrobe.getWardrobe(user_id);
    chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: `You are an AI assistant with access to a user's wardrobe: ${wd}.`,
        responseMimeType: "application/json",
        responseJsonSchema: zodToJsonSchema(replySchema),
      },
    });
  }
  const response = await chat.sendMessage({
    message: prompt,
  });
  const reply=replySchema.parse(JSON.parse(response.text))
  return reply;
}

async function parse_cloth(img_url) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a description of the clothing item at this url ${img_url}.
                      Only respond with the description of the clothing item.`,
      config: { tools: [{ urlContext: {} }] },
    });
    return response.text;
  } catch (error) {
    console.log("error in gemini.js parse_cloth:\n", error);
  }
}

export default { main, parse_cloth };