import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage, GuideBookingDetails, Itinerary } from '../types';
import { initializeChat, sendMessageToGemini, sendToolResponseToGemini, startLiveConversation, stopLiveConversation } from '../services/geminiService';
import { BOOK_GUIDE_FUNCTION_NAME, CREATE_ITINERARY_FUNCTION_NAME, PLACEHOLDER_IMAGE_URL } from '../constants';
import { Chat, GenerateContentResponse, FunctionCall } from '@google/genai';

interface ChatbotProps {
  onBookGuide: (details: GuideBookingDetails) => void;
  bookingSuccess: boolean;
  onAddNotification: (message: string) => void;
  onAddItinerary: (itinerary: Itinerary) => void;
  chatTriggerPrompt: string | null;
  onChatTriggerConsumed: () => void;
  isOpen: boolean; // New prop to control visibility
  onCloseChatbot: () => void; // New prop to close the chatbot
}

const Chatbot: React.FC<ChatbotProps> = ({ onBookGuide, bookingSuccess, onAddNotification, onAddItinerary, chatTriggerPrompt, onChatTriggerConsumed, isOpen, onCloseChatbot }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatInstanceRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMicrophoneActive, setIsMicrophoneActive] = useState(false);
  const [currentTranscription, setCurrentTranscription] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) { // Only scroll to bottom if chatbot is open
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Fix: Moved handleSendMessage declaration above its usage in useEffect
  const handleSendMessage = useCallback(async (messageOverride?: string) => {
    const userMessageText = messageOverride || input.trim() || currentTranscription.trim();
    if (!userMessageText) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', parts: [{ text: userMessageText }] },
      { role: 'model', parts: [{ text: '' }], isThinking: true },
    ]);
    setInput('');
    setError(null);
    setIsLoading(true);
    setCurrentTranscription('');

    try {
      await sendMessageToGemini(
        userMessageText,
        (chunk: GenerateContentResponse, isFunctionCallChunk: boolean) => {
          setMessages((prevMessages) => {
            const lastMessageIndex = prevMessages.length - 1;
            if (lastMessageIndex >= 0 && prevMessages[lastMessageIndex].role === 'model') {
              const lastModelMessage = { ...prevMessages[lastMessageIndex] };
              lastModelMessage.isThinking = false;
              if (chunk.text) {
                lastModelMessage.parts[0].text += chunk.text;
              }
              if (isFunctionCallChunk && chunk.functionCalls && chunk.functionCalls.length > 0) {
                lastModelMessage.parts[0].text += `\n🤖 Function call detected: ${JSON.stringify(chunk.functionCalls[0]?.name)}\n`;
              }
              return [...prevMessages.slice(0, lastMessageIndex), lastModelMessage];
            }
            return prevMessages;
          });
        },
        (functionCalls) => {
          if (functionCalls && functionCalls.length > 0) {
            const fc = functionCalls[0];
            if (fc.name === BOOK_GUIDE_FUNCTION_NAME) {
              const bookingDetails: GuideBookingDetails = {
                guideName: fc.args.guideName as string,
                activity: fc.args.activity as string,
                date: fc.args.date as string,
                time: fc.args.time as string,
                price: fc.args.price as number,
              };
              onBookGuide(bookingDetails);
              setMessages(prev => {
                const updatedMessages = [...prev];
                const lastModelMessageIndex = updatedMessages.findIndex(m => m.isThinking);
                if (lastModelMessageIndex !== -1) {
                  updatedMessages[lastModelMessageIndex] = {
                    ...updatedMessages[lastModelMessageIndex],
                    isThinking: false,
                    parts: [{ text: `Understood! Initiating booking for ${bookingDetails.guideName} for ${bookingDetails.activity} on ${bookingDetails.date} at ${bookingDetails.time} for $${bookingDetails.price}. Please confirm on the payment page. (Tool Call ID: ${fc.id})` }]
                  };
                }
                return updatedMessages;
              });
            } else if (fc.name === CREATE_ITINERARY_FUNCTION_NAME) {
              const itineraryDetails: Itinerary = {
                id: '',
                name: fc.args.name as string,
                duration: fc.args.duration as string,
                description: fc.args.description as string,
                places: fc.args.places as string[],
                activities: fc.args.activities as string[],
                imageUrl: PLACEHOLDER_IMAGE_URL,
              };
              onAddItinerary(itineraryDetails);
              sendToolResponseToGemini(
                fc.id,
                CREATE_ITINERARY_FUNCTION_NAME,
                { status: 'success', message: `Itinerary "${itineraryDetails.name}" created.` },
                (e) => setError(e.message || 'Failed to send itinerary creation response.'),
              );
              setMessages(prev => {
                const updatedMessages = [...prev];
                const lastModelMessageIndex = updatedMessages.findIndex(m => m.isThinking);
                if (lastModelMessageIndex !== -1) {
                  updatedMessages[lastModelMessageIndex] = {
                    ...updatedMessages[lastModelMessageIndex],
                    isThinking: false,
                    parts: [{ text: `Wonderful! I've crafted a new itinerary for you: "${itineraryDetails.name}". You can find it in the Itineraries section! (Tool Call ID: ${fc.id})` }]
                  };
                }
                return updatedMessages;
              });
            }
          }
        },
        (e) => {
          setError(e.message || 'An error occurred while communicating with Orbitto.');
          setMessages((prev) => prev.filter((msg) => !msg.isThinking));
        },
      );
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
      setMessages((prev) => prev.filter((msg) => !msg.isThinking));
    } finally {
      setIsLoading(false);
    }
  }, [input, currentTranscription, onBookGuide, onAddItinerary, onChatTriggerConsumed]);

  // Handle external prompt trigger
  useEffect(() => {
    if (chatTriggerPrompt && isOpen) { // Only trigger if chatbot is open
      handleSendMessage(chatTriggerPrompt);
      onChatTriggerConsumed(); // Notify parent that the prompt has been processed
    }
  }, [chatTriggerPrompt, onChatTriggerConsumed, isOpen, handleSendMessage]); // Depend on the prop and isOpen

  // Initialize chat when component mounts or opens
  useEffect(() => {
    if (!chatInstanceRef.current && isOpen) { // Only initialize if not already and if chatbot is open
      try {
        const initialChat = initializeChat(messages);
        chatInstanceRef.current = initialChat;
        setMessages(prev => [...prev, { role: 'model', parts: [{ text: 'Hello! I\'m Orbitto, your AI global assistant. How can I help you discover something amazing today? I can help you find places, suggest itineraries, or even book a travel guide!' }] }]);
      } catch (e: any) {
        setError(e.message || 'Failed to initialize chat. Please check your network and API key.');
        console.error("Chat initialization error in Chatbot:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // Depend on isOpen

  // Handle booking success feedback to Gemini
  useEffect(() => {
    if (bookingSuccess && isOpen) { // Only process if chatbot is open
      console.log('Booking confirmed, sending tool response to Gemini.');
      const lastFunctionCallMessage = messages
        .filter(msg => msg.role === 'model' && msg.parts.some(p => p.text.includes('Tool Call ID:')))
        .pop();

      const toolCallIdMatch = lastFunctionCallMessage?.parts[0]?.text.match(/Tool Call ID: (functionCall-[^)]+)/);
      const toolCallId = toolCallIdMatch ? toolCallIdMatch[1] : undefined;

      if (toolCallId) {
        sendToolResponseToGemini(
          toolCallId,
          BOOK_GUIDE_FUNCTION_NAME,
          { status: 'success', message: 'Travel guide booked successfully.' },
          (e) => setError(e.message || 'Failed to send booking success response.'),
        );
        setMessages(prev => [...prev, { role: 'model', parts: [{ text: 'Great! Your guide has been successfully booked. Enjoy your adventure!' }] }]);
        onAddNotification('Your travel guide has been successfully booked!');
      } else {
        console.warn('Could not find toolCallId for booking success response.');
      }
    }
  }, [bookingSuccess, messages, onAddNotification, isOpen]);


  const toggleMicrophone = async () => {
    if (isMicrophoneActive) {
      await stopLiveConversation();
      setIsMicrophoneActive(false);
      if (currentTranscription.trim()) {
        setInput(currentTranscription);
      }
      setCurrentTranscription('');
    } else {
      setIsMicrophoneActive(true);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: 'Microphone active. Please speak.' }] }]);
      try {
        await startLiveConversation(
          (text, isUser, isTurnComplete) => {
            if (isUser) {
              setCurrentTranscription(text);
            } else {
              // Model's transcription can also be shown
            }
          },
          (audioBuffer) => {
            // Audio is played by the service directly, but we can use this for visual feedback if needed
          },
          (e) => { // This onError now receives an ErrorEvent
            setError(e.message || 'Live conversation error.');
            setIsMicrophoneActive(false);
            console.error("Live conversation error in Chatbot:", e.error || e); // Log original error if available
          },
          (e) => {
            console.log('Live conversation closed:', e);
            setIsMicrophoneActive(false);
          },
        );
      } catch (e: any) { // Catch initial promise rejection from startLiveConversation
        setError(e.message || 'Could not start microphone. Please check permissions.');
        setIsMicrophoneActive(false);
        console.error("Failed to start live conversation:", e);
      }
    }
  };

  if (!isOpen) return null; // Don't render if not open

  return (
    <div 
      className="fixed bottom-24 right-8 z-50 w-full max-w-md h-[70vh] max-h-[600px] bg-gradient-to-br from-gray-900/90 to-blue-900/90 rounded-xl shadow-2xl overflow-hidden flex flex-col border border-fuchsia-400 backdrop-blur-md 
                 transition-all duration-300 ease-in-out transform scale-100 opacity-100 md:bottom-24 md:right-8 lg:max-w-xl
                 max-[600px]:inset-4 max-[600px]:w-auto max-[600px]:h-auto max-[600px]:max-h-[calc(100vh-8rem)] max-[600px]:max-w-[calc(100vw-2rem)]" // Responsive adjustments
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="chatbot-title"
    >
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white shadow-md">
        <h2 id="chatbot-title" className="text-xl font-bold">
          Orbitto AI Assistant
        </h2>
        <button
          onClick={onCloseChatbot}
          className="text-white hover:text-gray-200 text-2xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white rounded-full p-1"
          aria-label="Close chat assistant"
        >
          &times;
        </button>
      </div>

      <div className="flex-grow p-4 overflow-y-auto custom-scrollbar bg-gray-800">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] p-4 rounded-xl shadow-md ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-br-none'
                  : 'bg-gray-700 text-gray-100 rounded-bl-none border border-gray-600'
              } transition-all duration-300 ease-in-out transform hover:scale-105`}
              role="status"
              aria-live="polite"
            >
              {msg.parts.map((part, pIdx) => (
                <p key={pIdx} className="whitespace-pre-wrap">{part.text}</p>
              ))}
              {msg.isThinking && (
                <div className="flex items-center mt-2 text-sm text-gray-400">
                  <div className="dot-pulse mr-2">
                    <div className="dot-pulse-dot bg-fuchsia-400"></div>
                    <div className="dot-pulse-dot bg-fuchsia-400"></div>
                    <div className="dot-pulse-dot bg-fuchsia-400"></div>
                  </div>
                  <span>Thinking...</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {currentTranscription && isMicrophoneActive && (
          <div className="flex justify-end mb-4">
            <div className="max-w-[75%] p-4 rounded-xl shadow-md bg-blue-900/70 text-blue-100 rounded-br-none border border-blue-700 italic">
              <p>User (speaking): {currentTranscription}</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="p-4 bg-red-900/50 text-red-300 text-sm font-medium border-t border-red-700" role="alert">
          Error: {error}
        </div>
      )}

      <div className="p-4 bg-gray-900 border-t border-gray-700 flex items-center space-x-3">
        <button
          onClick={toggleMicrophone}
          className={`p-3 rounded-full ${isMicrophoneActive ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500' : 'bg-gradient-to-r from-blue-500 to-fuchsia-500 hover:from-blue-600 hover:to-fuchsia-600 focus:ring-fuchsia-500'} text-white transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 `}
          title={isMicrophoneActive ? 'Stop Voice Input' : 'Start Voice Input'}
          aria-label={isMicrophoneActive ? 'Stop voice input' : 'Start voice input'}
        >
          <i className={`fas ${isMicrophoneActive ? 'fa-stop' : 'fa-microphone'} text-lg`}></i>
        </button>
        <input
          type="text"
          className="flex-grow p-3 border border-gray-700 bg-gray-950 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 text-gray-100"
          placeholder={isMicrophoneActive ? "Speaking now..." : "Type your message..."}
          value={isMicrophoneActive ? currentTranscription : input}
          onChange={(e) => {
            if (!isMicrophoneActive) {
              setInput(e.target.value);
            }
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !isLoading) {
              handleSendMessage();
            }
          }}
          disabled={isLoading || isMicrophoneActive}
          aria-label="Message input field"
        />
        <button
          onClick={() => handleSendMessage()}
          className="bg-gradient-to-r from-blue-500 to-fuchsia-500 hover:from-blue-600 hover:to-fuchsia-600 text-white p-3 rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2"
          disabled={isLoading || (!input.trim() && !currentTranscription.trim())}
          title="Send Message"
          aria-label="Send message"
        >
          <i className="fas fa-paper-plane text-lg"></i>
        </button>
      </div>
    </div>
  );
};

export default Chatbot;