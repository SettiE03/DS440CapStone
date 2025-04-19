// App.tsx
import React, { useState } from "react";
import ResultCard from "./components/ResultCard";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ Step 1: Loading state

  const handleCheck = async () => {
    if (!url || !url.startsWith("http")) {
      alert(
        "Please enter a valid news article URL starting with http or https."
      );
      return;
    }

    setLoading(true); // ✅ Start loading

    try {
      const response = await fetch(
        "https://ds440capstone-2.onrender.com/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        }
      );

      const data = await response.json();

      if (data.error) {
        alert("Error: " + data.error);
      } else {
        setResult(data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Something went wrong. Please try again.");
    }

    setLoading(false); // ✅ Stop loading
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center px-4 py-8 relative">
        {/* Toggle Dark Mode */}
        <button
          className="absolute top-4 left-4 px-4 py-2 rounded-full bg-gray-300 dark:bg-gray-700 text-sm font-medium hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          onClick={() => setDarkMode(!darkMode)}
        >
          Toggle Dark/Light Mode
        </button>

        <h1 className="text-4xl font-bold mb-10 text-center">
          Fake News Detector
        </h1>

        {/* Input & Submit */}
        <div className="w-full max-w-2xl flex items-center space-x-3 mb-6">
          <input
            type="text"
            placeholder="Paste news article URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-grow px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCheck}
            disabled={loading} // ✅ Step 2: Disable while loading
            className={`px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Analyzing..." : "Submit"}
          </button>
        </div>

        {/* ✅ Show loading message */}
        {loading && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Analyzing article... please wait ⏳
          </p>
        )}

        {/* Results */}
        {result && <ResultCard result={result} />}
      </div>
    </div>
  );
}

export default App;
