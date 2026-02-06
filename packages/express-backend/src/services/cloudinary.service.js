import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function delete_image_from_cloudinary(public_id){
  await cloudinary.uploader.destroy(public_id);
}

export {delete_image_from_cloudinary}
