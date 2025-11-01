
import React from 'react';
import type { ContentItem } from '../types';
import { PlayIcon, InfoIcon, PlusIcon, CheckIcon } from './icons/Icons';

interface HeroSectionProps {
  item: ContentItem | null;
  isInMyList: boolean;
  onToggleMyList: (item: ContentItem) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ item, isInMyList, onToggleMyList }) => {
  if (!item) {
    return (
      <div className="h-[60vh] bg-gray-800 animate-pulse"></div>
    );
  }

  return (
    <div className="relative h-[60vh] md:h-[80vh] w-full">
      <div className="absolute inset-0">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-transparent"></div>
      </div>
      <div className="relative z-10 flex flex-col justify-end h-full p-4 md:p-12 lg:p-16">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">
            {item.title}
          </h2>
          <p className="mt-4 text-sm md:text-base text-gray-200 line-clamp-3 drop-shadow-lg">
            {item.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="flex items-center justify-center bg-white text-black font-bold py-2 px-6 rounded-lg hover:bg-gray-200 transition duration-300">
              <PlayIcon className="w-6 h-6 mr-2" />
              Play
            </button>
            <button
              onClick={() => onToggleMyList(item)}
              className="flex items-center justify-center bg-gray-600 bg-opacity-70 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-500 transition duration-300"
            >
              {isInMyList ? <CheckIcon className="w-6 h-6 mr-2" /> : <PlusIcon className="w-6 h-6 mr-2" />}
              {isInMyList ? 'In My List' : 'Add to List'}
            </button>
            <button className="flex items-center justify-center bg-gray-600 bg-opacity-70 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-500 transition duration-300">
              <InfoIcon className="w-6 h-6 mr-2" />
              More Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
