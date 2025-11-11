import express from "express"
import cors from "cors"
import gemini from"./gemini.js"

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
    res.send(reply)
})

app.get("/gemini/parse_cloth/:img_url",async(req,res)=>{
    console.log("backend.js get /gemini/parse_cloth/:img_url")
    const img_url=req.params.img_url
    const reply=await gemini.parse_cloth(img_url)
    res.send(reply)
})