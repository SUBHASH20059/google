
import React from 'react';
import { ContentCard, ContentCardSkeleton } from './ContentCard';
import type { ContentItem, Genre } from '../types';

interface ContentGridProps {
  items: ContentItem[];
  isLoading: boolean;
  title: string;
  genres: Genre[];
  selectedGenre: number | null;
  onSelectGenre: (genreId: number | null) => void;
  isInMyList: (itemId: number) => boolean;
  onToggleMyList: (item: ContentItem) => void;
}

export const ContentGrid: React.FC<ContentGridProps> = ({ items, isLoading, title, genres, selectedGenre, onSelectGenre, isInMyList, onToggleMyList }) => {
  const renderEmptyState = () => {
    let message = 'No content found. Try adjusting your search or filter.';
    if (title === 'My List') {
      message = 'Your list is empty. Add movies and shows to see them here!';
    } else if (selectedGenre) {
        message = `No content found in the selected genre. Try another one!`
    }

    return (
      <div className="text-center py-16">
        <p className="text-gray-400">{message}</p>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h3 className="text-2xl font-semibold text-white">{title}</h3>
        {title !== 'My List' && genres.length > 0 && (
          <div className="relative">
             <select
              value={selectedGenre ?? ''}
              onChange={(e) => onSelectGenre(e.target.value ? parseInt(e.target.value) : null)}
              className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full sm:w-48 p-2.5 appearance-none"
             >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre.id} value={genre.id}>{genre.name}</option>
              ))}
            </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        )}
      </div>
      
      {isLoading && items.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <ContentCardSkeleton key={index} />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {items.map((item) => (
            <ContentCard 
              key={`${item.id}-${item.title}`} 
              item={item} 
              isInMyList={isInMyList(item.id)}
              onToggleMyList={onToggleMyList}
            />
          ))}
        </div>
      ) : (
        renderEmptyState()
      )}
    </div>
  );
};
