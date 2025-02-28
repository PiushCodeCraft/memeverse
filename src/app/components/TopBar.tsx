"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";

export default function TopBar() {
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference from local storage
  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(storedMode);
    document.documentElement.classList.toggle("dark", storedMode);
  }, []);

  // Toggle dark mode and save preference
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
    document.documentElement.classList.toggle("dark", newMode);
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-50 shadow-md bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-2xl font-bold">
          <Link href="/">MemeVerse</Link>
        </h1>

        {/* Navigation Links */}
        <div className="space-x-6 text-lg font-medium flex items-center">
          <Link href="/" className="hover:text-yellow-500 dark:hover:text-yellow-300 transition">
            Home
          </Link>
          
          <Link href="/memeexplorer" className="hover:text-yellow-500 dark:hover:text-yellow-300 transition">
            Explore
          </Link>

          <Link href="/memeupload" className="hover:text-yellow-500 dark:hover:text-yellow-300 transition">
            Upload
          </Link>
          
          

          <Link href="/leaderboard" className="hover:text-yellow-500 dark:hover:text-yellow-300 transition">
            Leaderboard
          </Link>

          <Link href="/profile" className="hover:text-yellow-500 dark:hover:text-yellow-300 transition">
            Profile
          </Link>

          {/* Dark Mode Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          >
            {darkMode ? <Sun className="w-6 h-6 text-yellow-300" /> : <Moon className="w-6 h-6 text-gray-900" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
