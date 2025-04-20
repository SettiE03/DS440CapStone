// App.tsx
import React, { useState } from "react";
import ResultCard from "./components/ResultCard";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(""); // ✅ New state for feedback

  const handleCheck = async () => {
    if (!url || !url.startsWith("http")) {
      alert(
        "Please enter a valid news article URL starting with http or https."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://3835-34-82-203-119.ngrok-free.app/analyze",
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

    setLoading(false);
  };

  // ✅ Feedback submit function
  const handleFeedbackSubmit = async () => {
    if (!feedback) {
      alert("Please enter your feedback before submitting.");
      return;
    }

    try {
      const response = await fetch(
        "https://3835-34-82-203-119.ngrok-free.app/send-feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ feedback }),
        }
      );

      const data = await response.json();
      alert(data.message);
      setFeedback("");
    } catch (error) {
      console.error("Error sending feedback:", error);
      alert("There was a problem sending your feedback.");
    }
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
            disabled={loading}
            className={`px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Analyzing..." : "Submit"}
          </button>
        </div>

        {loading && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Analyzing article... please wait ⏳
          </p>
        )}

        {result && <ResultCard result={result} />}

        {/* ✅ Feedback Box */}
        <div className="w-full max-w-2xl mt-8">
          <h2 className="text-xl font-semibold mb-2">Submit Feedback</h2>
          <textarea
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Was this prediction helpful or accurate? Let us know!"
          />
          <button
            onClick={handleFeedbackSubmit}
            className="mt-3 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded transition"
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

