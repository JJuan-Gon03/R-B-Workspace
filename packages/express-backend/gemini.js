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
export default{main}