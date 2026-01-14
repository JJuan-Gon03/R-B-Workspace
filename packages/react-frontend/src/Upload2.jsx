import cloudinary from "./cloudinary.js"
import {useState } from "react"
import "./Upload2.css"

export default function Upload(){
    const[busy,setBusy]=useState(false)
    const[open,setOpen]=useState(false)
    const[name,setName]=useState("")
    const[color,setColor]=useState("")
    const[type,setType]=useState("")
    const[tags,setTags]=useState([])
    const[img,setImg]=useState(null)
    const[preview,setPreview]=useState("")

    async function onSubmit(event){
        event.preventDefault()
        if(busy||!name||!color||!type||!img)return;
        setBusy(true)
        const formData=new FormData()
        formData.append("file",img)
        formData.append("upload_preset","uploads")
        const img_url=await cloudinary.uploadImage(formData);
        await fetch("http://localhost:8000/wardrobe",{method:"POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id:123,name:name,color:color,type:type,
                tags:tags,img_url:img_url,}),});
        setImg(null)
        setPreview("")
        setTags([])
        setType("")
        setColor("")
        setName("")
        setBusy(false) 
    }
    
    if(!open){
        return(<button onClick={()=>setOpen(true)}>Upload</button>)
    }
    const fileSelected=(e)=>{
        const file=e.target.files?.[0]??null
        if(!file)return
        setImg(file)
        setPreview(URL.createObjectURL(file))
    }
    return (
        <div className="upload-overlay">
            <div className="upload-card">
            <button className="upload-close" onClick={() => setOpen(false)}>✕</button>

            <form className="upload-form" onSubmit={onSubmit}>
                <h2 className="upload-title">Upload Item</h2>

                <div className="upload-field">
                <label className="upload-label">Item Name</label>
                <input
                    className="upload-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                />
                </div>

                <div className="upload-field">
                <label className="upload-label">Color</label>
                <select
                    className="upload-select"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                >
                    <option value="" disabled>Select color</option>
                    {["Red","Orange","Yellow","Green","Blue","Purple","Brown","Gray","Black","White","Multi"].map(c =>
                    <option key={c} value={c}>{c}</option>
                    )}
                </select>
                </div>

                <div className="upload-field">
                <label className="upload-label">Type</label>
                <select
                    className="upload-select"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value="" disabled>Select type</option>
                    {["Shirts","Pants","Jackets","Shoes","Accessories"].map(t =>
                    <option key={t} value={t}>{t}</option>
                    )}
                </select>
                </div>

                <div className="upload-field">
                <label className="upload-label">Item Image</label>
                <input
                    className="upload-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => fileSelected(e)}
                />
                {preview && <img className="upload-preview" src={preview} alt="preview" />}
                </div>

                <button className="upload-btn" type="submit">
                Upload
                </button>
            </form>
            </div>
        </div>
        );

}