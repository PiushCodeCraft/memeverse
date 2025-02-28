"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function MemeDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [meme, setMeme] = useState<Meme | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchMeme = async () => {
      try {
        const docRef = doc(db, "memes", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMeme({ id: docSnap.id, ...docSnap.data() } as Meme);
        } else {
          setError("Meme not found.");
        }
      } catch (err) {
        console.error("Error fetching meme:", err);
        setError("Failed to load meme. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMeme();
  }, [id]);

  const handleLike = async () => {
    if (!meme) return;
    try {
      const docRef = doc(db, "memes", meme.id);
      await updateDoc(docRef, { likes: meme.likes + 1 });
      setMeme({ ...meme, likes: meme.likes + 1 });
    } catch (err) {
      console.error("Error updating like:", err);
      setError("Failed to like meme.");
    }
  };

  const handleComment = async () => {
    if (!meme || !comment.trim()) return;
    try {
      const docRef = doc(db, "memes", meme.id);
      await updateDoc(docRef, { comments: arrayUnion(comment) });
      setMeme({ ...meme, comments: [...meme.comments, comment] });
      setComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Failed to add comment.");
    }
  };

  if (loading) return <p className="text-white text-center text-lg">Loading meme details...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="p-6 text-white max-w-2xl mx-auto">
      <button onClick={() => router.back()} className="text-blue-400 hover:underline mb-4">
        ← Back
      </button>
      <h1 className="text-2xl font-bold text-center">{meme?.name}</h1>

      <div className="flex justify-center my-4">
        {meme?.url ? (
          <Image src={meme.url} alt={meme.name} width={500} height={500} className="rounded-lg shadow-lg" />
        ) : (
          <div className="w-64 h-64 flex items-center justify-center bg-gray-700 text-gray-300 rounded-lg">
            No Image
          </div>
        )}
      </div>

      <div className="flex justify-center space-x-4 my-4">
        <button
          onClick={handleLike}
          className="bg-blue-600 px-4 py-2 rounded-lg text-white font-semibold hover:bg-blue-700 transition"
        >
          👍 Like ({meme?.likes})
        </button>
      </div>

      {/* Comments Section */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Comments</h2>
        <div className="flex space-x-2">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-grow p-2 rounded-lg text-black"
          />
          <button
            onClick={handleComment}
            className="bg-green-600 px-4 py-2 rounded-lg text-white font-semibold hover:bg-green-700 transition"
          >
            Comment
          </button>
        </div>

        <ul className="mt-4 space-y-2">
          {meme && meme.comments.length > 0 ? (
            meme.comments.map((cmt, index) => (
              <li key={index} className="bg-gray-700 p-2 rounded-lg text-white">
                {cmt}
              </li>
            ))
          ) : (
            <p className="text-gray-400">No comments yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
