import * as dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({});

async function parse_upload(img) {
  const prompt =
    "From this image, parse the following: type of clothing (pants, shoes, tshirt, jacket, etc...); color; fit (loose, tight, baggy, etc...); keywords that describe the item (trendy, formal, dull, bright, tech, utility, comfortable, cotton, etc...)";

  try 
  {
    const response = await ai.generateContent({
      model: "gemini-2.5-flash",
      contents: [img, { text: prompt }],
    });

    console.log(response.text);
  } 
  catch (error) 
  {
    console.error(error);
  }
}

async function generate_outfit(wardrobe, user_input) {
  const prompt =
    "From this image, parse the following: type of clothing (pants, shoes, tshirt, jacket, etc...); color; fit (loose, tight, baggy, etc...); keywords that describe the item (trendy, formal, dull, bright, tech, utility, comfortable, cotton, etc...)";

  try 
  {
    const response = await ai.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ text: prompt + user_input }],
    });
    
    console.log(response.text);
  } 
  catch (error) 
  {
    console.error(error);
  }
}
