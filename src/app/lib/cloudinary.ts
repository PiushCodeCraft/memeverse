import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: { method: string; body: { file: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { url?: string; error?: string; }): void; new(): any; }; }; }) {
  if (req.method === "POST") {
    try {
      const fileStr = req.body.file;
      const uploadResponse = await cloudinary.v2.uploader.upload(fileStr, {
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      });
      res.status(200).json({ url: uploadResponse.secure_url });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}