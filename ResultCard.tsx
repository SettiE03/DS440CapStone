// components/ResultCard.tsx
import React from "react";

type ResultProps = {
  result: {
    probability: number;
    credibility: string;
    keywords: string[];
  };
};

function ResultCard({ result }: ResultProps) {
  if (!result) return null;

  return (
    <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Content Evaluation
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="font-medium text-gray-700 dark:text-gray-300">
            Fake News Score
          </p>
          <div className="mt-1 px-3 py-2 rounded bg-blue-100 dark:bg-blue-700 text-blue-900 dark:text-white inline-block font-semibold">
            {(result.probability * 100).toFixed(2)}%
          </div>
        </div>

        <div>
          <p className="font-medium text-gray-700 dark:text-gray-300">
            Source Credibility
          </p>
          <div className="mt-1 px-3 py-2 rounded bg-green-100 dark:bg-green-700 text-green-900 dark:text-white inline-block font-semibold">
            {result.credibility}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Highlighted Words/Phrases
        </h3>
        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-100">
          <ul className="list-disc pl-5">
            {result.keywords.map((word, index) => (
              <li key={index}>{word}</li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          User Feedback
        </h3>
        <textarea
          placeholder="Share your feedback..."
          className="w-full mt-1 p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>
    </div>
  );
}

export default ResultCard;
