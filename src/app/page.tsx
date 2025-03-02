"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const isValidUrl = (urlString: string): boolean => {
  try {
    new URL(urlString);
    return true;
  } catch {
    try {
      new URL(`https://${urlString}`);
      return true;
    } catch {
      return false;
    }
  }
};

const prependHttps = (url: string) => {
  return url.startsWith("http") ? url : `https://${url}`;
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!isValidUrl(url.trim())) {
        throw new Error("Invalid URL format");
      }

      const formattedUrl = prependHttps(url.trim());

      const response = await fetch("https://api.preseneti.me/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ longUrl: formattedUrl }),
      });

      if (!response.ok) throw new Error("Failed to shorten URL");

      const data = await response.json();
      setShortenedUrl(data.shortUrl);
    } catch (err) {
      setError("Failed to shorten URL. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortenedUrl);
      toast.success("Copied!", {
        position: "bottom-center",
        style: {
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          color: "#4B5563",
          padding: "8px 16px",
          borderRadius: "8px",
          fontSize: "14px",
          maxWidth: "200px",
        },
        duration: 1500,
      });
    } catch (err) {
      toast.error("Failed to copy", {
        position: "bottom-center",
        style: {
          background: "rgba(239, 68, 68, 0.9)",
          backdropFilter: "blur(10px)",
          color: "white",
          padding: "8px 16px",
          borderRadius: "8px",
          fontSize: "14px",
          maxWidth: "200px",
        },
      });
      console.error("Failed to copy URL to clipboard", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-radial from-gray-900 via-purple-900 to-gray-950 flex items-center justify-center">
      <Toaster position="top-center" />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-gray-900/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-800/50">
          <h1 className="text-4xl font-bold text-center mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
              Shortener
            </span>
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL (e.g., youtube.com)"
                required
                className="w-full p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg 
                          text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 
                          focus:border-transparent backdrop-blur-sm transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full p-4 bg-purple-600 text-white rounded-lg font-semibold
                        transform hover:scale-[1.02] transition-all duration-200 
                        disabled:opacity-50 disabled:cursor-not-allowed
                        hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/20"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                  <span>Shortening...</span>
                </div>
              ) : (
                "Shorten URL"
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-800/50 rounded-lg">
              <p className="text-red-200 text-center">{error}</p>
            </div>
          )}

          {shortenedUrl && (
            <div className="mt-8 p-6 bg-gray-800/30 rounded-lg border border-gray-700/50">
              <p className="text-gray-400 text-sm mb-2">Your shortened URL:</p>
              <div className="flex items-center space-x-3">
                <a
                  href={shortenedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-300 hover:text-purple-200 break-all flex-1"
                >
                  {shortenedUrl}
                </a>
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-purple-600/20 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-purple-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
