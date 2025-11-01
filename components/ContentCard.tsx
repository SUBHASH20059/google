
import React, { useState } from 'react';
import type { ContentItem } from '../types';
import { PlayIcon, PlusIcon, CheckIcon } from './icons/Icons';

interface ContentCardProps {
  item: ContentItem;
  isInMyList: boolean;
  onToggleMyList: (item: ContentItem) => void;
}

export const ContentCard: React.FC<ContentCardProps> = ({ item, isInMyList, onToggleMyList }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggleList = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleMyList(item);
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 300); // Animation duration
  };
  
  return (
    <div className="group relative rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300 ease-in-out cursor-pointer">
      <span className="pointer-events-none absolute -top-10 left-1/2 z-30 w-max max-w-[90%] -translate-x-1/2 rounded-md bg-gray-900/90 px-3 py-1.5 text-center text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
        {item.title}
      </span>
      <button 
        onClick={handleToggleList}
        aria-label={isInMyList ? 'Remove from My List' : 'Add to My List'}
        className={`absolute top-2 right-2 z-20 p-1.5 bg-black bg-opacity-60 rounded-full text-white hover:bg-opacity-80 transition-all duration-200 ${isAnimating ? 'animate-pop' : ''}`}
      >
        {isInMyList ? <CheckIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
      </button>

      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300"></div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <PlayIcon className="w-12 h-12 text-white drop-shadow-lg" />
      </div>
       <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black via-black/70 to-transparent">
        <h4 className="text-white text-sm font-semibold truncate">{item.title}</h4>
      </div>
    </div>
  );
};

export const ContentCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-lg bg-gray-800 animate-pulse aspect-[2/3]"></div>
  );
};