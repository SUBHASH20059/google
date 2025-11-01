
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ContentGrid } from './components/ContentGrid';
import { Footer } from './components/Footer';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { ChatBot } from './components/ChatBot';
import { ApiKeyModal } from './components/ApiKeyModal';
import { Toast } from './components/Toast';
import { fetchTmdbContent, fetchTmdbGenres } from './services/tmdbService';
import type { ContentItem, Genre } from './types';
import { CATEGORIES } from './constants';

function App() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [myList, setMyList] = useState<ContentItem[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPrivacyModalOpen, setPrivacyModalOpen] = useState(false);
  
  const [tmdbApiKey, setTmdbApiKey] = useState<string | null>(null);
  const [isApiKeyModalOpen, setApiKeyModalOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const toastTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem('tmdbApiKey');
    if (storedKey) {
      setTmdbApiKey(storedKey);
    } else {
      setIsLoading(false);
      setApiKeyModalOpen(true);
    }

    try {
      const savedList = localStorage.getItem('myList');
      if (savedList) {
        setMyList(JSON.parse(savedList));
      }
    } catch (e) {
      console.error("Failed to load My List from localStorage", e);
      setMyList([]);
    }

    // Cleanup toast timeout on component unmount
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);
  
  const fetchAllData = useCallback(async (category: string, apiKey: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const [items, genreList] = await Promise.all([
        fetchTmdbContent(category, apiKey),
        genres.length === 0 ? fetchTmdbGenres(apiKey) : Promise.resolve(genres)
      ]);
      setContent(items);
      if (genres.length === 0) {
        setGenres(genreList);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to fetch content. ${errorMessage}`);
      console.error(err);
      setContent([]);
    } finally {
      setIsLoading(false);
    }
  }, [genres]);

  useEffect(() => {
    if (selectedCategory === 'my-list') {
      setIsLoading(false);
      setError(null);
      return;
    }
    if (tmdbApiKey) {
      fetchAllData(selectedCategory, tmdbApiKey);
    }
  }, [selectedCategory, tmdbApiKey, fetchAllData]);
  
  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setSelectedGenre(null); // Reset genre filter when category changes
  };

  const handleSaveApiKey = (key: string) => {
    localStorage.setItem('tmdbApiKey', key);
    setTmdbApiKey(key);
    setApiKeyModalOpen(false);
  };
  
  const showToast = useCallback((message: string) => {
    if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(message);
    setIsToastVisible(true);
    toastTimeoutRef.current = window.setTimeout(() => {
        setIsToastVisible(false);
    }, 2500);
  }, []);

  const isInMyList = useCallback((itemId: number) => {
    return myList.some(item => item.id === itemId);
  }, [myList]);

  const toggleMyList = useCallback((itemToAddOrRemove: ContentItem) => {
    let newList;
    const itemIsInList = isInMyList(itemToAddOrRemove.id);

    if (itemIsInList) {
      newList = myList.filter(item => item.id !== itemToAddOrRemove.id);
      showToast("Removed from My List");
    } else {
      newList = [...myList, itemToAddOrRemove];
      showToast("Added to My List");
    }
    setMyList(newList);
    localStorage.setItem('myList', JSON.stringify(newList));
  }, [myList, isInMyList, showToast]);
  
  const contentToDisplay = useMemo(() => {
    if (selectedCategory === 'my-list') {
      return myList;
    }
    return content;
  }, [selectedCategory, content, myList]);


  const filteredContent = useMemo(() => {
    let items = contentToDisplay;

    if (searchQuery) {
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedGenre) {
        items = items.filter(item => item.genre_ids.includes(selectedGenre));
    }
    
    return items;
  }, [contentToDisplay, searchQuery, selectedGenre]);

  const heroItem = useMemo(() => {
    if (filteredContent.length > 0) return filteredContent[0];
    if (contentToDisplay.length > 0) return contentToDisplay[0];
    return null;
  }, [filteredContent, contentToDisplay]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <ApiKeyModal isOpen={isApiKeyModalOpen} onSave={handleSaveApiKey} />
      <Header
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <main className="flex-grow">
        {isLoading && (
          <div className="h-[60vh] flex items-center justify-center">
             <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}
        {error && (
           <div className="h-[60vh] flex flex-col items-center justify-center text-red-400 text-xl text-center px-4">
             <p>{error}</p>
             <button 
                onClick={() => setApiKeyModalOpen(true)} 
                className="mt-4 bg-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-700 transition duration-300">
                Change API Key
              </button>
           </div>
        )}
        {!isLoading && !error && !tmdbApiKey && (
           <div className="h-[60vh] flex flex-col items-center justify-center text-gray-300 text-xl text-center px-4">
             <p>Please enter your TMDb API key to browse content.</p>
             <button 
                onClick={() => setApiKeyModalOpen(true)} 
                className="mt-4 bg-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-700 transition duration-300">
                Enter API Key
              </button>
           </div>
        )}
        {!isLoading && !error && tmdbApiKey && heroItem && (
          <HeroSection 
            item={heroItem} 
            isInMyList={isInMyList(heroItem.id)}
            onToggleMyList={toggleMyList}
          />
        )}
        {tmdbApiKey && !error && (
          <ContentGrid 
            items={filteredContent} 
            isLoading={isLoading} 
            title={CATEGORIES.find(c => c.id === selectedCategory)?.name || 'All Content'} 
            genres={genres}
            selectedGenre={selectedGenre}
            onSelectGenre={setSelectedGenre}
            isInMyList={isInMyList}
            onToggleMyList={toggleMyList}
          />
        )}
      </main>
      <Footer onPrivacyClick={() => setPrivacyModalOpen(true)} />
      <PrivacyPolicyModal isOpen={isPrivacyModalOpen} onClose={() => setPrivacyModalOpen(false)} />
      <ChatBot />
      <Toast message={toastMessage} isVisible={isToastVisible} />
    </div>
  );
}

export default App;
