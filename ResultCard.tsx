import React from "react";

interface ResultProps {
  result: {
    probability: number;
    credibility: string;
    keywords: string[];
  };
}

const ResultCard: React.FC<ResultProps> = ({ result }) => {
  const { probability, credibility, keywords } = result;

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mt-6">
      <h2 className="text-2xl font-semibold mb-4">Content Evaluation</h2>

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Fake News Score
          </p>
          <div className="text-lg font-bold text-blue-500">
            {(probability * 100).toFixed(2)}%
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Source Credibility
          </p>
          <div
            className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
              credibility === "High" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {credibility}
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Highlighted Words/Phrases
        </p>
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm text-gray-800 dark:text-gray-100">
          <ul className="list-disc list-inside space-y-1">
            {keywords.map((word, index) => (
              <li key={index}>{word}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
