import "dotenv/config"
import{GoogleGenAI}from"@google/genai"

const ai=new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});

async function main(prompt){
    console.log("gemini.js main")
    try{
        const response=await ai.models.generateContent({
            model:"gemini-2.5-flash",
            contents:prompt
        })
        return response.text
    }catch(error){console.log(error)}
}

async function parse_cloth(img_url){
    console.log("gemini.js parse_cloth")
    try{
        const response=await ai.models.generateContent({
            model:"gemini-2.5-flash",
            contents:`can you give me a detailed description of the clothing item at this url? ${img_url}`,
            config:{tools:[{urlContext:{}}]},
        })
        return response.text
    }catch(error){console.log(error)}
}

export default{main,parse_cloth}