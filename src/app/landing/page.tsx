"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import MemeGallery from "../components/MemeGallery";
import TopBar from "../components/TopBar";

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 px-6 transition-colors duration-300 dark:bg-gray-900 dark:text-white">
      {/* Top Bar */}
      <TopBar />

      {/* Hero Section */}
      <motion.h1
        className="text-6xl font-extrabold text-center mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to <span className="text-yellow-500 dark:text-yellow-400">MemeVerse</span>
      </motion.h1>

      <motion.p
        className="text-lg text-gray-700 dark:text-gray-300 text-center max-w-2xl mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        Discover, create, and share the funniest memes on the internet. Join our
        community and start your meme journey today!
      </motion.p>

      {/* Meme Gallery */}
      {/* <memegallery /> */}
      <MemeGallery />

      {/* Buttons */}
      <div className="flex space-x-4 mt-6">
        <Link href="/memeexplorer">
          <motion.button
            className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-yellow-500 transition dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:text-black"
            whileHover={{ scale: 1.05 }}
          >
            Explore Memes
          </motion.button>
        </Link>

        <Link href="/memeupload">
          <motion.button
            className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-blue-600 transition dark:bg-blue-400 dark:hover:bg-blue-500 dark:text-black"
            whileHover={{ scale: 1.05 }}
          >
            Upload Meme
          </motion.button>
        </Link>
      </div>

      {/* Footer */}
      <motion.footer
        className="mt-8 text-gray-600 dark:text-gray-400 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        Made with ❤️ by MemeVerse Team
      </motion.footer>
    </main>
  );
}
