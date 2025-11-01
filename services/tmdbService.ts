
import type { ContentItem, Genre } from '../types';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const contentCache = new Map<string, ContentItem[]>();
const genreCache = new Map<string, Genre[]>();

interface TmdbItem {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  genre_ids: number[];
  vote_average: number;
}

function mapTmdbItemToContentItem(item: TmdbItem, category: string): ContentItem {
  return {
    id: item.id,
    title: item.title || item.name || 'Untitled',
    description: item.overview,
    imageUrl: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : 'https://picsum.photos/400/600',
    category: category,
    genre_ids: item.genre_ids || [],
  };
}

export async function fetchTmdbGenres(apiKey: string): Promise<Genre[]> {
    const cacheKey = `genres-${apiKey.slice(-4)}`;
    if (genreCache.has(cacheKey)) {
        return genreCache.get(cacheKey)!;
    }

    if (!apiKey) {
        throw new Error("TMDb API key is required.");
    }

    try {
        const [movieResponse, tvResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/genre/movie/list?api_key=${apiKey}&language=en-US`),
            fetch(`${API_BASE_URL}/genre/tv/list?api_key=${apiKey}&language=en-US`)
        ]);

        if (!movieResponse.ok || !tvResponse.ok) {
            throw new Error('Failed to fetch genres.');
        }

        const [movieData, tvData] = await Promise.all([movieResponse.json(), tvResponse.json()]);
        
        const genresMap = new Map<number, string>();
        [...movieData.genres, ...tvData.genres].forEach((genre: Genre) => {
            genresMap.set(genre.id, genre.name);
        });

        const mergedGenres: Genre[] = Array.from(genresMap, ([id, name]) => ({ id, name }))
            .sort((a, b) => a.name.localeCompare(b.name));
        
        genreCache.set(cacheKey, mergedGenres);
        return mergedGenres;

    } catch (error) {
        console.error("Error fetching genres from TMDb:", error);
        throw error;
    }
}


export async function fetchTmdbContent(category: string, apiKey: string): Promise<ContentItem[]> {
  const cacheKey = `${category}-${apiKey.slice(-4)}`;
  if (contentCache.has(cacheKey)) {
    return contentCache.get(cacheKey)!;
  }

  if (!apiKey) {
    throw new Error("TMDb API key is required.");
  }
  
  let endpoint = '';
  switch (category) {
    case 'all':
      endpoint = '/trending/all/week';
      break;
    case 'movies':
      endpoint = '/movie/popular';
      break;
    case 'web series':
      endpoint = '/tv/popular';
      break;
    case 'anime':
      endpoint = '/discover/tv?with_genres=16&with_keywords=210024&sort_by=popularity.desc';
      break;
    case 'shows':
      endpoint = '/tv/on_the_air';
      break;
    default:
      throw new Error(`Unknown category: ${category}`);
  }

  const url = `${API_BASE_URL}${endpoint}?api_key=${apiKey}&language=en-US&page=1`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Your TMDb API key may be invalid.');
      }
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    
    if (!data.results || !Array.isArray(data.results)) {
        throw new Error("Invalid data format received from TMDb API");
    }

    const contentItems = data.results
      .filter((item: TmdbItem) => item.poster_path)
      .map((item: TmdbItem) => mapTmdbItemToContentItem(item, category));
    
    contentCache.set(cacheKey, contentItems);
    return contentItems;

  } catch (error) {
    console.error(`Error fetching content for category ${category} from TMDb:`, error);
    throw error;
  }
}
