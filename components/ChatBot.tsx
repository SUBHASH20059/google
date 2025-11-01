import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { generateChatResponse, ChatMode } from '../services/geminiService';
import { ChatBubbleIcon, XIcon, SendIcon, LightbulbIcon, GlobeIcon } from './icons/Icons';

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [geminiApiKey, setGeminiApiKey] = useState<string | null>(null);
  const [tempApiKey, setTempApiKey] = useState('');
  const [chatMode, setChatMode] = useState<ChatMode>('lite');

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const initialMessages: Record<ChatMode, ChatMessage> = {
    lite: {
      role: 'model',
      text: "Hi there! I'm the StreamVerse assistant, running on a low-latency model for quick answers. How can I help?",
    },
    thinking: {
      role: 'model',
      text: "Thinking Mode activated. I'm now using a more powerful model to handle complex questions. What's on your mind?",
    },
    search: {
      role: 'model',
      text: "Search Mode activated. I can now browse the web to give you the most up-to-date information. What are you looking for?",
    },
  };

  const placeholders: Record<ChatMode, string> = {
      lite: "Ask a quick question...",
      thinking: "Ask a complex question...",
      search: "Search the web...",
  };

  useEffect(() => {
    const storedKey = localStorage.getItem('geminiApiKey');
    if (storedKey) {
      setGeminiApiKey(storedKey);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setChatMode('lite'); // Reset mode on close
      return;
    }
    
    if (geminiApiKey) {
      // Set the initial message for the current mode
      setMessages([initialMessages[chatMode]]);
    } else {
      // Clear messages if no API key is present
      setMessages([]);
    }
  }, [isOpen, geminiApiKey, chatMode]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !geminiApiKey) return;

    const userMessage: ChatMessage = { role: 'user', text: inputMessage };
    const currentHistory = [...messages];
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const result = await generateChatResponse(geminiApiKey, currentHistory, userMessage.text, chatMode);
      const modelMessage: ChatMessage = { role: 'model', text: result.text, sources: result.sources };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error(`Error sending message to Gemini (${chatMode} mode):`, error);
      const errorMessage: ChatMessage = { role: 'model', text: 'Sorry, I seem to be having trouble connecting. Your API key might be invalid, or the model is currently unavailable. Please try again.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      const newKey = tempApiKey.trim();
      setGeminiApiKey(newKey);
      localStorage.setItem('geminiApiKey', newKey);
      setTempApiKey('');
    }
  };

  const handleModeChange = (newMode: ChatMode) => {
    setChatMode(currentMode => {
        // If clicking the same mode icon, toggle it off to 'lite'
        if (currentMode === newMode) {
            return 'lite';
        }
        return newMode;
    });
  };

  const toggleChat = () => setIsOpen(!isOpen);

  const ApiKeyInputView = (
    <div className="flex-grow p-6 flex flex-col justify-center items-center text-center">
        <h4 className="font-semibold text-white mb-2">AI Assistant Setup</h4>
        <p className="text-sm text-gray-300 mb-4">
            Please provide your Google AI API key to enable the chat assistant.
        </p>
        <a 
            href="https://ai.google.dev/gemini-api/docs/api-key" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-purple-400 hover:underline text-sm mb-4"
        >
            Get your Gemini API key here.
        </a>
        <input
            type="password"
            value={tempApiKey}
            onChange={(e) => setTempApiKey(e.target.value)}
            placeholder="Paste your Gemini API Key"
            className="w-full bg-gray-900 text-white placeholder-gray-400 border border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition mb-4"
        />
        <button
            onClick={handleSaveApiKey}
            disabled={!tempApiKey.trim()}
            className="bg-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition duration-300 w-full"
        >
            Save Key & Start Chatting
        </button>
    </div>
  );

  const ChatView = (
      <>
        <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs md:max-w-sm lg:max-w-md px-4 py-2 rounded-2xl flex flex-col ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white rounded-br-lg'
                    : 'bg-gray-700 text-gray-200 rounded-bl-lg'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                 {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-gray-600">
                        <h5 className="text-xs font-semibold text-gray-400 mb-1.5">Sources:</h5>
                        <div className="space-y-1">
                            {msg.sources.map((source, i) => (
                                <a 
                                    key={i} 
                                    href={source.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-xs text-purple-300 hover:underline block truncate"
                                    title={source.title || source.uri}
                                >
                                   {i + 1}. {source.title || source.uri}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
              </div>
            </div>
          ))}
           {isLoading && (
            <div className="flex justify-start">
               <div className="max-w-xs md:max-w-sm lg:max-w-md px-4 py-2 rounded-2xl bg-gray-700 text-gray-200 rounded-bl-lg flex items-center space-x-2">
                 <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-75"></span>
                 <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-150"></span>
                 <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-300"></span>
               </div>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 p-4 border-t border-gray-700">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={placeholders[chatMode]}
              disabled={isLoading}
              className="w-full bg-gray-900 text-white placeholder-gray-400 border border-gray-700 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="bg-purple-600 text-white rounded-full p-2 disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500"
              aria-label="Send message"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </>
  );

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full p-4 shadow-lg hover:scale-110 transform transition-transform duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-300"
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
        >
          {isOpen ? <XIcon className="w-8 h-8" /> : <ChatBubbleIcon className="w-8 h-8" />}
        </button>
      </div>

      <div
        className={`fixed bottom-24 right-6 z-50 w-[calc(100%-3rem)] max-w-md h-[70vh] max-h-[600px] bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col transition-all duration-500 ease-in-out transform-gpu
        ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'}`}
      >
        <div className="flex-shrink-0 p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">StreamVerse Assistant</h3>
            <div className="flex items-center space-x-2">
                <button 
                    onClick={() => handleModeChange('search')}
                    title="Search Mode"
                    aria-label="Toggle Search Mode"
                    className={`p-1.5 rounded-full transition-colors duration-200 ${chatMode === 'search' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                >
                    <GlobeIcon className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => handleModeChange('thinking')}
                    title="Thinking Mode"
                    aria-label="Toggle Thinking Mode"
                    className={`p-1.5 rounded-full transition-colors duration-200 ${chatMode === 'thinking' ? 'bg-yellow-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                >
                    <LightbulbIcon className="w-5 h-5" />
                </button>
            </div>
        </div>

        {geminiApiKey ? ChatView : ApiKeyInputView}

      </div>
    </>
  );
};
