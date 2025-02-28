"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Meme {
  id: string;
  name: string;
  url: string;
  likes: number; // Simulated likes
}

interface User {
  id: string;
  username: string;
  engagementScore: number; // Simulated engagement score
}

// Fetch top memes from Imgflip API
async function fetchTopMemes(): Promise<Meme[]> {
  const response = await fetch("https://api.imgflip.com/get_memes");
  const data = await response.json();

  if (!data.success) {
    console.error("Failed to fetch memes:", data.error_message);
    return [];
  }

  // Simulate likes for each meme (since the API doesn't provide likes)
  const memesWithLikes = data.data.memes.map((meme: any) => ({
    id: meme.id,
    name: meme.name,
    url: meme.url,
    likes: Math.floor(Math.random() * 1000), // Random likes for simulation
  }));

  // Sort by likes and return top 10
  return memesWithLikes.sort((a: Meme, b: Meme) => b.likes - a.likes).slice(0, 10);
}

// Simulate user rankings based on engagement
async function fetchTopUsers(): Promise<User[]> {
  // Mock user data
  const users: User[] = [
    { id: "1", username: "user1", engagementScore: 950 },
    { id: "2", username: "user2", engagementScore: 800 },
    { id: "3", username: "user3", engagementScore: 750 },
    { id: "4", username: "user4", engagementScore: 700 },
    { id: "5", username: "user5", engagementScore: 650 },
  ];

  // Sort by engagement score
  return users.sort((a, b) => b.engagementScore - a.engagementScore);
}

export default function Leaderboard() {
  const [topMemes, setTopMemes] = useState<Meme[]>([]);
  const [topUsers, setTopUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchTopMemes().then(setTopMemes);
    fetchTopUsers().then(setTopUsers);
  }, []);

  return (
<div className="max-w-4xl mx-auto p-6 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg mt-20 ">
  <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">Leaderboard</h1>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {/* Top 10 Memes Section */}
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Top 10 Memes</h2>
      <div className="space-y-4">
        {topMemes.map((meme, index) => (
          <div key={meme.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <span className="text-lg font-bold text-gray-800 dark:text-white">{index + 1}.</span>
              <Image
                src={meme.url}
                alt={meme.name}
                width={80}
                height={80}
                className="w-20 h-20 rounded-lg"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{meme.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{meme.likes} likes</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Top Users Section */}
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Top Users</h2>
      <div className="space-y-4">
        {topUsers.map((user, index) => (
          <div key={user.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <span className="text-lg font-bold text-gray-800 dark:text-white">{index + 1}.</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{user.username}</h3>
                <p className="text-gray-600 dark:text-gray-400">Engagement Score: {user.engagementScore}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
    );
    }