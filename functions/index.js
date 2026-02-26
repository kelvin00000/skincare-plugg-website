// functions/index.js
const functions = require("firebase-functions/v2");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dnn8wbubn",
  api_key: "539841944381758",
  api_secret: "HYzbi_PJNO0WjUFVgLyZmCPXWlU",
});

exports.deleteImage = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).send("");
  }

  const {publicId} = req.body;

  if (!publicId) {
    return res.status(400).json({error: "publicId required"});
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    res.json({success: true, result});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});
