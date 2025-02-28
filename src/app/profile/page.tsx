"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { AiOutlineEdit } from "react-icons/ai";

const API_KEY = "1e4e1b159e9b1706ac80f6ef28796667"; // 🔹 Replace with your actual ImgBB API key

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState("/default-avatar.png");
  const [uploadedMemes, setUploadedMemes] = useState<string[]>([]);
  const [likedMemes, setLikedMemes] = useState<string[]>([]);

  useEffect(() => {
    const storedProfile = localStorage.getItem("profile");
    if (storedProfile) {
      const { name, bio, profilePic } = JSON.parse(storedProfile);
      setName(name);
      setBio(bio);
      setProfilePic(profilePic);
    }

    setLikedMemes(JSON.parse(localStorage.getItem("likedMemes") || "[]"));
    fetchUploadedMemes();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    try {
      const uploadedUrl = await uploadToImgBB(e.target.files[0]);
      setProfilePic(uploadedUrl);
      saveProfile(name, bio, uploadedUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const saveProfile = (newName: string, newBio: string, newPic: string) => {
    localStorage.setItem(
      "profile",
      JSON.stringify({ name: newName, bio: newBio, profilePic: newPic })
    );
  };

  const fetchUploadedMemes = async () => {
    try {
      const response = await fetch(
        `https://api.imgbb.com/1/account/images?key=${API_KEY}`
      );
      if (!response.ok) throw new Error("Failed to fetch uploaded memes");

      const data = await response.json();
      const memeUrls = data.data.map((meme: any) => meme.url);
      setUploadedMemes(memeUrls);
    } catch (error) {
      console.error("Error fetching uploaded memes:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <div className="relative">
        <Image
          src={profilePic}
          alt="Profile Picture"
          width={150}
          height={150}
          className="rounded-full shadow-lg object-cover border-4 border-white dark:border-gray-700"
        />
        <label
          htmlFor="file-upload"
          className="absolute bottom-2 right-2 bg-gray-700 dark:bg-gray-500 text-white p-2 rounded-full cursor-pointer"
        >
          <AiOutlineEdit />
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Name Input */}
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mt-4 text-xl font-bold text-center bg-transparent border-b-2 border-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
      />

      {/* Bio Input */}
      <input
        type="text"
        placeholder="Enter your bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="mt-2 text-gray-600 dark:text-gray-300 text-center bg-transparent border-b border-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
      />

      <button
        onClick={() => saveProfile(name, bio, profilePic)}
        className="mt-4 bg-blue-500 dark:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Save Profile
      </button>

      {/* Uploaded Memes Section */}
      <h3 className="text-xl font-semibold mt-6">Your Uploaded Memes</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 bg-gray-200 dark:bg-gray-800 p-4 rounded-lg">
        {uploadedMemes.length > 0 ? (
          uploadedMemes.map((meme, index) => (
            <Image
              key={index}
              src={meme}
              alt={`Meme ${index}`}
              width={150}
              height={150}
              className="rounded-lg shadow"
            />
          ))
        ) : (
          <p>No memes uploaded yet.</p>
        )}
      </div>

      {/* Liked Memes Section */}
      <h3 className="text-xl font-semibold mt-6">Liked Memes</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 bg-gray-200 dark:bg-gray-800 p-4 rounded-lg">
        {likedMemes.length > 0 ? (
          likedMemes.map((meme, index) => (
            <Image
              key={index}
              src={meme}
              alt={`Liked Meme ${index}`}
              width={150}
              height={150}
              className="rounded-lg shadow"
            />
          ))
        ) : (
          <p>No liked memes yet.</p>
        )}
      </div>
    </div>
  );
};

const uploadToImgBB = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${API_KEY}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  const data = await response.json();
  return data.data.url; // Returns the direct image URL from ImgBB
};

export default ProfilePage;
