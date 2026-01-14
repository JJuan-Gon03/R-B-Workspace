async function uploadImage(formData) {
  const upload = await fetch(
    `https://api.cloudinary.com/v1_1/dviu8ll3d/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await upload.json();
  return data.secure_url;
}

export default { uploadImage };
