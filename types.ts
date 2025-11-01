
export interface ContentItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  genre_ids: number[];
}

export interface Category {
  id: string;
  name: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  sources?: { uri: string; title: string }[];
};

export interface Genre {
  id: number;
  name: string;
}
