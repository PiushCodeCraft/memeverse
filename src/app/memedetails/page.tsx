"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@firebaseConfig";
import Image from "next/image";

interface Meme {
  id: string;
  name: string;
  url: string;
  likes: number;
  comments: string[];
}

function useParams() {
  const router = useRouter();
  return { id: router.query.id };
}

export default function MemeDetail() {
  const router = useRouter();
  const { id } = useParams();
  const [meme, setMeme] = useState<Meme | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  console.log("Meme ID from useParams():", id);
  
  useEffect(() => {
    if (!id) return;
  
    console.log("Fetching meme with ID:", id); // Debugging
  
    const fetchMeme = async () => {
      try {
        console.log("Fetching meme with ID:", id);
        const docRef = doc(db, "memes", id as string);
        console.log("Firestore doc path:", docRef.path);
    
        const docSnap = await getDoc(docRef);
        console.log("Document exists?", docSnap.exists());
    
        if (docSnap.exists()) {
          console.log("Meme Data:", docSnap.data());
          setMeme({ id: docSnap.id, ...docSnap.data() } as Meme);
        } else {
          setError("Meme not found.");
        }
      } catch (err) {
        console.error("Error fetching meme:", err);
        setError("Failed to load meme.");
      } finally {
        setLoading(false);
      }
    };
    
  
    fetchMeme();
  }, [id]);
  

  const handleLike = async () => {
    if (!meme) return;
    const docRef = doc(db, "memes", meme.id);
    await updateDoc(docRef, { likes: meme.likes + 1 });
    setMeme({ ...meme, likes: meme.likes + 1 });
  };

  const handleComment = async () => {
    if (!meme || !comment.trim()) return;
    const docRef = doc(db, "memes", meme.id);
    await updateDoc(docRef, { comments: arrayUnion(comment) });
    setMeme({ ...meme, comments: [...meme.comments, comment] });
    setComment("");
  };

  if (loading) return <p className="text-white text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="p-6 text-white">
      {meme && <h1 className="text-2xl font-bold text-center">{meme.name}</h1>}
      {meme && (
        <div className="flex justify-center my-4">
          <Image src={meme.url} alt={meme.name} width={500} height={500} className="rounded-lg" />
        </div>
      )}
      {meme && <p className="text-center text-gray-400">👍 {meme.likes} Likes</p>}
      <button onClick={handleLike} className="bg-blue-600 p-2 rounded mt-2">Like</button>
      
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Comments</h2>
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-2 mt-2 text-black rounded"
        />
        <button onClick={handleComment} className="bg-green-600 p-2 rounded mt-2">Comment</button>

        <ul className="mt-4">
          {meme && meme.comments.map((cmt, index) => (
            <li key={index} className="bg-gray-700 p-2 mt-1 rounded">{cmt}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}