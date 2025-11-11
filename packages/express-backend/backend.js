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

app.get("/response/:text",async(req,res)=>{
    console.log("backend.js get /response/:text")
    const text=req.params.text
    const reply=await gemini.main(text)
    res.send(reply)
})