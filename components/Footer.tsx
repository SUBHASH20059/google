
import React from 'react';
import { FacebookIcon, TwitterIcon, InstagramIcon } from './icons/Icons';

interface FooterProps {
  onPrivacyClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onPrivacyClick }) => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            StreamVerse
          </h2>
          <div className="flex justify-center mt-4">
            <a href="#" className="mx-3 text-gray-400 hover:text-white" aria-label="Facebook">
              <FacebookIcon className="w-6 h-6" />
            </a>
            <a href="#" className="mx-3 text-gray-400 hover:text-white" aria-label="Twitter">
              <TwitterIcon className="w-6 h-6" />
            </a>
            <a href="#" className="mx-3 text-gray-400 hover:text-white" aria-label="Instagram">
              <InstagramIcon className="w-6 h-6" />
            </a>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row sm:justify-center sm:space-x-4 text-sm text-gray-400">
              <a href="#" className="hover:text-white">About Us</a>
              <a href="#" className="mt-2 sm:mt-0 hover:text-white">Contact</a>
              <button onClick={onPrivacyClick} className="mt-2 sm:mt-0 hover:text-white">Privacy Policy</button>
              <a href="#" className="mt-2 sm:mt-0 hover:text-white">Terms of Service</a>
          </div>
        </div>
        <hr className="my-6 border-gray-800" />
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} StreamVerse. All rights reserved. This is a fictional service for demonstration purposes.
        </p>
      </div>
    </footer>
  );
};
