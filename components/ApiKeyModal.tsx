
import React, { useState } from 'react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onSave: (apiKey: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSave }) => {
  const [apiKey, setApiKey] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-[100] flex justify-center items-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Enter TMDb API Key</h2>
        </div>
        <div className="p-6 text-gray-300 space-y-4 text-sm">
          <p>
            To fetch real-time movie and show data, StreamVerse requires an API key from The Movie Database (TMDb).
          </p>
          <p>
            You can get a free key by signing up on their website.
            <a 
              href="https://www.themoviedb.org/signup" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-purple-400 hover:underline ml-1"
            >
              Get your key here.
            </a>
          </p>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Paste your TMDb API Key (v3 auth)"
            className="w-full bg-gray-900 text-white placeholder-gray-400 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
        </div>
        <div className="p-4 border-t border-gray-700 text-right">
          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="bg-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition duration-300"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
