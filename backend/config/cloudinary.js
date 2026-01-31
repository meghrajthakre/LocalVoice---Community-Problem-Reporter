const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadImage = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "localvoice/reports",
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};
