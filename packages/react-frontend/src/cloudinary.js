async function uploadImage(formData) {
  console.log("entering cloudinary.js uploadImage");
  const upload = await fetch(
    `https://api.cloudinary.com/v1_1/dviu8ll3d/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await upload.json();
  console.log(
    "exiting cloudinary.js uploadImage, returning url:\n",
    data.secure_url
  );
  return data.secure_url;
}

export default { uploadImage };
