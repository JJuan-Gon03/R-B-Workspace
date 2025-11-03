import * as dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({});

async function parse_upload(img) {
  const prompt = `
  From this image of a clothing item, generate the most detailed description, including but not limited to: 
  
  type of clothing (tshirt, pant, shoes, ...),
  fit (baggy, loose, ...),
  color(s),
  fabric (cotton, polyester, ...),
  descriptions (utility, formal, streetwear, cozy, ...).

  ONLY reply with the description in your response.
  `;

  try {
    const result = await ai.generateContent({
      model: "gemini-2.5-flash",
      contents: [img, { text: prompt }],
    });

    return result.response.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error(error);
  }
}

async function build_outfit(wardrobe, user_input) {
  const prompt = `
    Pick out pieces of clothing from a text-based wardrobe to build an outfit of the user's description.

    Wardrobe: ${wardrobe}. The wardrobe contains clothing items, each containing an id and a item description.
    User's description of the outfit they want to build: ${user_input}.

    If the user's wardrobe is limited or does not contain items that fit the look they are going for, 
    give a most detailed description of a clothing item that would.

    Format your response like this:
    if you are using items from the wardrobe, id: (id of item)
    if you are picking out a clothing item not from the wardrobe, description: (description of item)

    explain your decisions in picking out clothing items.
    
    ONLY reply like this in your response: (explanation), id: (id of item), ..., description: (description of item), ...
    Where every id and description is seperated by commas, ... represents 0 or more ids or descriptions, and all ids come before descriptions.
    `;
  try {
    const result = await ai.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ text: prompt }],
    });

    return result.response.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error(error);
  }
}

async function generate_outfit(images, descriptions) {
  const prompt = `

    `;
  try {
    const result = await ai.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ text: prompt }],
    });

    return result.response.candidates[0].content.parts[0].inlineData.data;
  } catch (error) {
    console.error(error);
  }
}
