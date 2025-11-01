import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { ChatMessage } from '../types';

export type ChatMode = 'lite' | 'thinking' | 'search';

interface ChatResponse {
    text: string;
    sources?: { uri: string; title: string }[];
}

const SYSTEM_INSTRUCTION = 'You are a friendly and helpful assistant for StreamVerse, an entertainment streaming platform. Answer questions about movies, web series, anime, and shows. Keep your answers concise and engaging.';

export async function generateChatResponse(
  apiKey: string,
  history: ChatMessage[],
  userMessage: string,
  mode: ChatMode
): Promise<ChatResponse> {
  const ai = new GoogleGenAI({ apiKey });

  let modelName: string;
  let config: any = {};
  
  switch (mode) {
    case 'thinking':
      modelName = 'gemini-2.5-pro';
      config = {
        thinkingConfig: { thinkingBudget: 32768 },
      };
      break;
    case 'search':
      modelName = 'gemini-2.5-flash';
      config = {
        tools: [{ googleSearch: {} }],
      };
      break;
    case 'lite':
    default:
      modelName = 'gemini-flash-lite-latest';
      break;
  }

  // Exclude the initial greeting message from the history sent to the model
  const conversationHistory = history.length > 1 ? history.slice(1) : [];

  const contents = [
    ...conversationHistory.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    })),
    {
      role: 'user',
      parts: [{ text: userMessage }],
    },
  ];

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: modelName,
    contents,
    config: {
        ...config,
        systemInstruction: SYSTEM_INSTRUCTION
    }
  });

  const result: ChatResponse = { text: response.text };

  if (mode === 'search' && response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
    result.sources = response.candidates[0].groundingMetadata.groundingChunks
        .map(chunk => chunk.web)
        .filter((web): web is { uri: string; title: string } => !!(web?.uri && web.title))
        .map(web => ({ uri: web.uri, title: web.title }));
  }

  return result;
}
