import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import wardrobe from "./wardrobe.js";
import preferences from "./preferences.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
let chat = null;

async function main(prompt, user_id) {
  console.log("entering gemini.js main");
  if (!chat) {
    const wd = await wardrobe.getWardrobe(user_id);
    const prefs = await preferences.getPreferences(user_id);
    chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: `You are an AI assistant that will help the user create outfits.
                        These are the descriptions of clothing items the user owns: ${wd}.
                        Your job is to come up with an outfit of the user's preference.
                        Here are some of the user's past preferences: ${prefs}.
                        Try to use items in the wardrobe if possible, but if another clothing item
                        would fit better, give the user a detailed description of the item, and explain 
                        the reasoning behind your outfit. If you do use the user's clothing item, be sure to let them know.`,
      },
    });
  }
  parse_prefs(prompt, user_id);
  const response = await chat.sendMessage({
    message: prompt,
  });
  console.log(`exiting gemini.js main`);
  return response.text;
}

async function parse_prefs(text, user_id) {
  console.log("entering gemini.js parse_prefs");
  const prefs = await preferences.getPreferences(user_id);
  console.log(prefs);
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Your job is to parse this text for user preferences: ${text}.
                 Retrieve information of height, gender, age, skin tone, permanent prefences of outfit types (ex. dark aesthetic, formal, ...).
                 Here are the user's previous preferences ${prefs}. Extend this preference list.
                 Do not duplicate data, but you may rewrite preferences to be more concise or overwrite old information. 
                 Keep a list of temporary outfit types, when an majority appears, 
                 you may add that outfit type preference to the user's permanent preferences.
                 Only respond with the preference information. `,
  });

  preferences.updatePreferences({
    preferences: response.text,
    user_id: user_id,
  });
  console.log(response.text);
  console.log("exiting gemini.js parse_prefs");
}

async function parse_cloth(img_url) {
  console.log("entering gemini.js parse_cloth");
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a detailed description of the clothing item at this url ${img_url}.
                      Only respond with the description of the clothing item.`,
      config: { tools: [{ urlContext: {} }] },
    });
    console.log("exiting gemini.js parse_cloth");
    return response.text;
  } catch (error) {
    console.log("error in gemini.js parse_cloth:\n", error);
  }
}

export default { main, parse_cloth };

// const outfitSchema=z.object({
//     descriptions:z.array(z.string()).describe("descriptions of clothes the AI assistant believes will be a good candidate for the outfit the user is trying to build. use existing descriptions if using clothes in user's wardrobe, else make new descriptions"),
//     reply:z.string().describe("an explanation of the AI's outfit idea")
// })

// async function buildOutfit(wardrobe,preferences){
//     console.log("entering gemini.js buildOutfit")
//     try{
//         const response=await ai.models.generateContent({
//             model:"gemini-2.5-flash",
//             contents:`You are a AI assistant in Fashion. Here is the outfit the user wants to build ${preferences}, and here is their wardrobe ${wardrobe},
//                       try to use clothes the user owns, but if not possible, describe in great detail a clothing piece that would be perfect for their outfit.`,
//             config:{responseMimeType:"application/json",responseJsonSchema:zodToJsonSchema(outfitSchema)},
//         })
//         const otft=outfitSchema.parse(JSON.parse(response.text))
//         const imgdata=example_img
//         console.log("exiting gemini.js buildOutfit")
//         return {reply:otft.reply,imgdata:imgdata}
//     }catch(error){console.log("error in gemini.js buildOutfit:\n",error)}
// }

// async function generateOutfit(descriptions){
//     console.log("gemini.js generateOutfit")
//     try{
//         const response=await ai.models.generateContent({
//             model:"gemini-2.0-flash-preview-image-generation",
//             contents:[{parts:[{text:`You are an AI in generating outfit images. Here are the clothing item descriptions that you must include in the image: ${descriptions}
//                             Generate the image of a model in these clothes.`}]}],
//             config: {
//                 response_mime_type: "image/png",
//             },
//         })
//         for (const part of response.parts) {
//             if (part.text) {
//                 console.log(part.text);
//             } else if (part.inlineData) {
//                 const imageData = part.inlineData.data;
//                 return `data:image/png;base64,${imageData}`
//             }
//         }
//     }catch(error){console.log(error)}
// }
