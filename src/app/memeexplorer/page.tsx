"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { debounce } from "lodash";
import { useInView } from "react-intersection-observer";
import React from "react";

interface Meme {
  id: string;
  name: string;
  url: string;
  likes: number;
  date: string;
  comments: number;
}

const categories = ["Trending", "New", "Classic", "Random"];
const sortOptions = ["Likes", "Date", "Comments"];

export default function MemeExplorer() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [filteredMemes, setFilteredMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Trending");
  const [sortBy, setSortBy] = useState("Likes");

  const { ref, inView } = useInView();
  const uniqueMemeIds = new Set<string>(); // Store unique meme IDs

  useEffect(() => {
    fetchMemes();
  }, []);

  useEffect(() => {
    filterAndSortMemes();
  }, [selectedCategory, sortBy, memes]);

  useEffect(() => {
    if (inView) {
      loadMoreMemes();
    }
  }, [inView]);

  const fetchMemes = async () => {
    try {
      const response = await fetch("https://api.imgflip.com/get_memes");
      const data = await response.json();

      if (data.success) {
        const newMemes = (data.data.memes as Meme[])
          .map((meme) => ({
            ...meme,
            likes: Math.floor(Math.random() * 1000),
            date: new Date(
              Date.now() - Math.floor(Math.random() * 31556952000)
            ).toISOString(),
            comments: Math.floor(Math.random() * 500),
          }))
          .filter((meme) => {
            if (uniqueMemeIds.has(meme.id)) {
              return false; // Ignore duplicate memes
            }
            uniqueMemeIds.add(meme.id);
            return true;
          });

        setMemes((prevMemes) => [...prevMemes, ...newMemes]);
      }
    } catch (error) {
      console.error("Error fetching memes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortMemes = () => {
    let filtered = memes.filter((meme) =>
      meme.name.toLowerCase().includes(query.toLowerCase())
    );

    switch (selectedCategory) {
      case "New":
        filtered = filtered.filter(
          (meme) =>
            new Date(meme.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        );
        break;
      case "Classic":
        filtered = filtered.slice(0, 10);
        break;
      case "Random":
        filtered = filtered.sort(() => Math.random() - 0.5);
        break;
    }

    filtered.sort((a, b) => {
      if (sortBy === "Likes") return b.likes - a.likes;
      if (sortBy === "Date") return new Date(b.date) > new Date(a.date) ? -1 : 1;
      if (sortBy === "Comments") return b.comments - a.comments;
      return 0;
    });

    setFilteredMemes(filtered.slice(0, page * 10));
  };

  const loadMoreMemes = () => {
    setPage((prev) => prev + 1);
    setFilteredMemes((prev) => [
      ...prev,
      ...memes.slice(page * 10, (page + 1) * 10),
    ]);
  };

  const handleSearch = useCallback(
    debounce((value: string) => {
      setQuery(value);
      setPage(1);
      filterAndSortMemes();
    }, 500),
    [memes, selectedCategory, sortBy]
  );

  if (loading)
    return <p className="text-center text-white">Loading memes...</p>;

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search memes..."
          className="p-2 border rounded-lg bg-gray-700 text-white"
          onChange={(e) => handleSearch(e.target.value)}
        />

        <select
          className="p-2 border rounded-lg bg-gray-700 text-white"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          className="p-2 border rounded-lg bg-gray-700 text-white"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          {sortOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Meme Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMemes.map((meme) => (
          <div
            key={meme.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
          >
            <div className="relative w-full h-64">
              <Image
                src={meme.url}
                alt={meme.name}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
                priority
              />
            </div>
            <div className="p-2 text-white text-center">
              <p className="font-bold">{meme.name}</p>
              <p className="text-sm">
                ❤️ {meme.likes} | 💬 {meme.comments}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Infinite Scroll Trigger */}
      <div ref={ref} className="h-10 mt-4"></div>
    </div>
  );
}
