import { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { image } = req.body;
    const uploadedImage = await cloudinary.uploader.upload(image, { folder: "profile_pictures" });

    res.status(200).json({ url: uploadedImage.secure_url });
  } catch (error) {
    res.status(500).json({ error: "Upload failed" });
  }
}
