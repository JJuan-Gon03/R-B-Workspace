import React, { useState } from "react";
import cloudinary from "./cloudinary.js";

function Upload({ updateClothesDisplay }) {
  const [image, setImage] = useState(null);

  async function onSubmit(event) {
    console.log("entering Upload.jsx handle submit");
    event.preventDefault();

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "uploads");

    const imgurl = await cloudinary.uploadImage(formData);

    const res = await fetch(
      "http://localhost:8000/gemini/parse_cloth/" + encodeURIComponent(imgurl)
    );
    const res_text = await res.text();

    fetch("http://localhost:8000/wardrobe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: res_text,
        imgurl: imgurl,
        user_id: 123,
      }),
    });
    setImage(null);
    updateClothesDisplay?.(imgurl);
    console.log("exiting upload.js handle submit");
  }

  return (
    <div className="upload-wrapper">
      <form onSubmit={onSubmit} className="upload-form">
        {/* hid real file input */}
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          className="file-input-hidden"
          onChange={(e) => setImage(e.target.files[0])}
        />

        {/* choose image button */}
        <label htmlFor="file-upload" className="custom-upload-btn">
          Choose Image
        </label>

        {/* show filename */}
        <span className="file-name">
          {image ? image.name : "No file chosen"}
        </span>

        <button type="submit" className="submit-upload-btn">
          Upload
        </button>
      </form>

      {image && (
        <img
          src={URL.createObjectURL(image)}
          alt="preview"
          className="preview-img"
        />
      )}
    </div>
  );
}
export default Upload;
