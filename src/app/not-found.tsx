import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      {/* Meme Image */}
      <Image
        src="/meme.jpg"
        alt="404 Meme"
        height={400}
        width={400}
        className="rounded-lg shadow-lg dark:shadow-gray-800"
      />

      {/* Playful Text */}
      <h1 className="text-4xl font-bold mt-8">
        Oops! You&apos;re Lost in the Memeverse
      </h1>
      <p className="text-lg text-gray-600 mt-4">
        The page you&apos;re looking for doesn&apos;t exist. But hey, at least you found this meme!
      </p>

      {/* Back to Home Button */}
      <Link
        href="/"
        className="mt-8 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600
                  dark:bg-blue-700 dark:hover:bg-blue-800 transition duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
}
