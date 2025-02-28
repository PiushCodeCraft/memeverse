"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const MemeUpload = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const textRef = useRef<HTMLDivElement>(null);

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Generate AI caption
  const generateAiCaption = async () => {
    try {
      const response = await fetch("https://api.imgflip.com/get_memes");
      const data = await response.json();
      const memes = data.data.memes;
      const randomMeme = memes[Math.floor(Math.random() * memes.length)];
      setText(randomMeme.name);
    } catch (error) {
      console.error("Failed to generate AI caption:", error);
      alert("Failed to generate AI caption. Please try again.");
    }
  };

  // Upload image to ImgBB
  const handleUpload = async () => {
    if (!image) {
      alert("Please upload an image!");
      return;
    }

    setUploading(true);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = document.createElement("img");
    img.src = preview!;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      if (text) {
        ctx!.font = "40px Impact";
        ctx!.fillStyle = textColor;
        ctx!.strokeStyle = "black";
        ctx!.lineWidth = 2;
        ctx!.textAlign = "center";
        ctx!.fillText(text, canvas.width / 2, canvas.height - 20);
        ctx!.strokeText(text, canvas.width / 2, canvas.height - 20);
      }

      canvas.toBlob(async (blob) => {
        if (blob) {
          const formData = new FormData();
          formData.append("image", blob);

          try {
            const response = await fetch(
              `https://api.imgbb.com/1/upload?key=1e4e1b159e9b1706ac80f6ef28796667`,
              { method: "POST", body: formData }
            );

            const data = await response.json();
            if (data.data?.url) {
              setUploadedUrl(data.data.url);
              alert("Meme uploaded successfully!");
              window.location.reload();
            } else {
              alert("Upload failed");
            }
          } catch (error) {
            console.error("Upload error:", error);
            alert("Something went wrong");
          } finally {
            setUploading(false);
          }
        }
      }, "image/jpeg");
    };
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <div className="border-4 border-gray-700 rounded-lg p-4">
        <h1 className="text-3xl font-bold mb-4">Upload and Edit Your Meme</h1>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4"
        />
        {preview && (
          <div className="relative mb-4">
            <Image
              src={preview}
              alt="Meme Preview"
              width={400}
              height={300}
              className="rounded-lg shadow-lg"
            />
            {text && (
              <div
                ref={textRef}
                className="absolute text-4xl font-impact w-full text-center"
                style={{
                  bottom: "10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: textColor,
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
                }}
              >
                {text}
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col space-y-4 w-full max-w-md">
          <input
            type="text"
            placeholder="Enter text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="px-4 py-2 border rounded bg-white dark:bg-gray-800 dark:border-gray-600"
          />
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium">Text Color:</label>
            <div className="relative">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className="w-10 h-10 rounded-full border-2 border-gray-400 shadow-md"
                style={{ backgroundColor: textColor }}
              ></div>
            </div>
          </div>

          <button
            onClick={generateAiCaption}
            className="px-4 py-2 bg-blue-500 dark:bg-blue-700 text-white rounded"
          >
            Generate AI Caption
          </button>
          <button
            onClick={handleUpload}
            className={`px-4 py-2 rounded ${
              uploading
                ? "bg-gray-400 dark:bg-gray-600"
                : "bg-green-500 dark:bg-green-700 text-white"
            }`}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Meme"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemeUpload;
