async function uploadImage(formData) {
  const upload = await fetch(
    `https://api.cloudinary.com/v1_1/dviu8ll3d/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await upload.json();
  return { img_url: data.secure_url, public_id: data.public_id };
}

async function getImgURL(img_file) {
  const formData = new FormData();
  formData.append("file", img_file);
  formData.append("upload_preset", "uploads");
  return uploadImage(formData);
}

export default { getImgURL };
