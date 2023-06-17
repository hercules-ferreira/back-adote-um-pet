const cloudinary = require("cloudinary").v2;

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storagepet = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: (req, files) => "pets",
    resource_type: "image",
    // public_id: (req, res) => "profile",
  },
});

const uploadCloudinarypet = multer({ storagepet });
module.exports = uploadCloudinarypet;
