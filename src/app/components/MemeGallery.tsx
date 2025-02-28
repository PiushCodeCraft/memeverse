"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "@firebaseConfig";
import Image from "next/image";
import Link from "next/link";

interface Meme {
  id: string;
  name: string;
  url: string;
  likes: number;
  comments: string[];
}

export default function MemeGallery() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndStoreMemes = async () => {
      try {
        console.log("Fetching memes from API...");
        const apiResponse = await fetch("https://api.imgflip.com/get_memes");
        const apiData = await apiResponse.json();
        console.log("API response:", apiData);

        if (!apiData.success) throw new Error("Failed to fetch memes");

        // Get existing memes from Firestore
        console.log("Fetching memes from Firestore...");
        const firestoreMemes = await getDocs(collection(db, "memes"));
        const existingMemeIds = new Set(firestoreMemes.docs.map((doc) => doc.id));
        console.log("Existing memes in Firestore:", existingMemeIds);

        // Filter out already stored memes
        const newMemes = apiData.data.memes
          .filter((meme: Meme) => !existingMemeIds.has(meme.id))
          .map((meme: Meme) => ({
            ...meme,
            likes: 0,
            comments: [],
          }));
        console.log("New memes to store:", newMemes);

        // Store new memes in Firestore
        for (const meme of newMemes) {
          await setDoc(doc(db, "memes", meme.id), meme);
        }

        // Fetch memes from Firestore
        console.log("Fetching updated memes from Firestore...");
        const updatedMemes = await getDocs(collection(db, "memes"));
        setMemes(updatedMemes.docs.map((doc) => doc.data() as Meme));
        console.log("Updated memes:", updatedMemes.docs.map((doc) => doc.data() as Meme));
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndStoreMemes();
  }, []);

  if (loading) return <p className="text-center text-white">Loading memes...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {memes.map((meme) => (
        <Link key={meme.id} href={`/meme/${meme.id}`}>
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer">
            <div className="relative w-full h-64">
              {meme.url ? (
                <Image
                  src={meme.url}
                  alt={meme.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-t-lg"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700">
                  <p className="text-white">No Image</p>
                </div>
              )}
            </div>
            <p className="text-white text-center p-2 font-bold">{meme.name}</p>
            <p className="text-gray-400 text-center p-1">❤️ {meme.likes} | 💬 {meme.comments.length}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}