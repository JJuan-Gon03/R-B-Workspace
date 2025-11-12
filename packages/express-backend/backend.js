import express from "express"
import cors from "cors"
import gemini from"./gemini.js"
import wardrobe from"./wardrobe.js"

const app=express()
const port=8000

app.use(express.json())
app.use(cors())
app.listen(port,()=>{
    console.log(`http://localhost:${port}`)
})

app.get("/",(req,res)=>{res.send("hi")})

app.get("/gemini/response/:text",async(req,res)=>{
    console.log("backend.js get /response/:text")
    const text=req.params.text
    const reply=await gemini.main(text)
    res.status(200).send(reply)
})

app.get("/gemini/parse_cloth/:img_url",async(req,res)=>{
    console.log("backend.js get /gemini/parse_cloth/:img_url")
    const img_url=req.params.img_url
    const reply=await gemini.parse_cloth(img_url)
    res.status(200).send(reply)
})

app.post("/wardrobe",async(req,res)=>{
    console.log("backend.js post /wardrobe")
    wardrobe.addCloth(req.body)
    res.status(201).send()
})

app.get("/wardrobe/:user_id",async(req,res)=>{
    console.log("backend.js get /wardrobe/:user_id")
    const wd=await wardrobe.getWardrobe(req.params.user_id)
    res.status(201).send(wd)
})