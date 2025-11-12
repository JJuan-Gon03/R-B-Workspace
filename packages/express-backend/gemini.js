import "dotenv/config"
import{GoogleGenAI}from"@google/genai"
import{z}from"zod"
import{zodToJsonSchema}from"zod-to-json-schema"

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

const outfitSchema=z.object({
    descriptions:z.array(z.string()).describe("descriptions of clothes the AI assistant believes will be a good candidate for the outfit the user is trying to build. use existing descriptions if using clothes in user's wardrobe, else make new descriptions"),
    reply:z.string().describe("an explanation of the AI's outfit idea")
})

async function buildOutfit(wardrobe,preferences){
    console.log("gemini.js buildOutfit")
    try{
        const response=await ai.models.generateContent({
            model:"gemini-2.5-flash",
            contents:`You are a AI assistant in Fashion. Here is the outfit the user wants to build ${preferences}, and here is their wardrobe ${wardrobe},
                      try to use clothes the user owns, but if not possible, describe in great detail a clothing piece that would be perfect for their outfit.`,
            config:{responseMimeType:"application/json",responseJsonSchema:zodToJsonSchema(outfitSchema)},
        })
        return outfitSchema.parse(JSON.parse(response.text))
    }catch(error){console.log(error)}
}

// async function generateOutfit(descriptions){
//     console.log("gemini.js generateOutfit")
//     try{
//         const response=await ai.models.generateContent({
//             model:"gemini-2.5-flash",
//             contents:`You are a AI assistant in Fashion. Here is the outfit the user wants to build ${preferences}, and here is their wardrobe ${wardrobe},
//                       try to use clothes the user owns, but if not possible, describe in great detail a clothing piece that would be perfect for their outfit.`,
//             config:{responseMimeType:"application/json",responseJsonSchema:zodToJsonSchema(outfitSchema)},
//         })
//         return outfitSchema.parse(JSON.parse(response.text))
//     }catch(error){console.log(error)}
// }

export default{main,parse_cloth,buildOutfit}