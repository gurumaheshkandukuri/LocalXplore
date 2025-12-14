import { GoogleGenAI, Chat, GenerateContentResponse, FunctionDeclaration, Type, LiveServerMessage, Modality, FunctionCall } from '@google/genai';
import { ChatMessage, GroundingChunk, UserLocation } from '../types';
import { bookTravelGuideFunctionDeclaration, BOOK_GUIDE_FUNCTION_NAME, GEMINI_CHAT_MODEL, GEMINI_EXPLORE_MODEL, createItineraryFunctionDeclaration, CREATE_ITINERARY_FUNCTION_NAME } from '../constants';

// The `nextStartTime` variable acts as a cursor to track the end of the audio playback queue.
// Scheduling each new audio chunk to start at this time ensures smooth, gapless playback.
let nextStartTime = 0;
// Fix: Use new AudioContext() directly as it's widely supported
const outputAudioContext = new (window.AudioContext ||
  (window as any).webkitAudioContext)({sampleRate: 24000}); // Added cross-browser compatibility
const outputNode = outputAudioContext.createGain();
outputNode.connect(outputAudioContext.destination); // Connect outputNode to destination
const sources = new Set<AudioBufferSourceNode>();

// Define the expected media blob type for Gemini Live API
interface GeminiMediaBlob {
  data: string; // Base64 encoded string
  mimeType: string;
}

// Utility function to create a new GoogleGenAI instance
export function getGeminiInstance(): GoogleGenAI {
  if (!process.env.API_KEY) {
    throw new Error('API_KEY is not defined in environment variables.');
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
}

let activeChat: Chat | null = null;
let liveSessionPromise: Promise<any> | null = null; // Store the promise for the live session

export const initializeChat = (history: ChatMessage[]): Chat => {
  try {
    const ai = getGeminiInstance();
    activeChat = ai.chats.create({
      model: GEMINI_CHAT_MODEL,
      config: {
        tools: [{ functionDeclarations: [bookTravelGuideFunctionDeclaration, createItineraryFunctionDeclaration] }],
      },
      // Fix: Map chat history parts to the correct Part object format { text: string }
      history: history.map(msg => ({
        role: msg.role,
        parts: msg.parts.map(p => ({ text: p.text })),
      })),
    });
    return activeChat;
  } catch (error: any) {
    console.error('Gemini chat initialization error:', error);
    // Throw a more specific error that the UI can catch and display
    throw new Error(`Failed to initialize chat. Please ensure your API key is valid and try again. (Details: ${error.message})`);
  }
};

export const sendMessageToGemini = async (
  message: string,
  onStream: (chunk: GenerateContentResponse, isFunctionCall: boolean) => void,
  onComplete: (functionCalls: FunctionCall[] | undefined) => void,
  onError: (error: Error) => void,
) => {
  if (!activeChat) {
    onError(new Error('Chat not initialized.'));
    return;
  }

  try {
    const streamResponse = await activeChat.sendMessageStream({ message });
    let fullResponse = '';
    let functionCalls: FunctionCall[] | undefined;

    for await (const chunk of streamResponse) {
      if (chunk.text) {
        fullResponse += chunk.text;
        onStream(chunk, false);
      }
      if (chunk.functionCalls && chunk.functionCalls.length > 0) {
        functionCalls = chunk.functionCalls;
        onStream(chunk, true); // Indicate that a function call chunk was received
      }
    }
    onComplete(functionCalls);
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    onError(new Error(`Failed to get response from Orbitto. Please try again. (Details: ${error.message})`));
  }
};

export const sendToolResponseToGemini = async (
  toolCallId: string | undefined,
  functionName: string,
  result: any,
  onError: (error: Error) => void,
) => {
  if (!activeChat) {
    onError(new Error('Chat not initialized.'));
    return;
  }
  if (!toolCallId) {
    onError(new Error('Tool call ID is missing.'));
    return;
  }

  try {
    // Fix: sendMessage for tool responses should use 'parts' parameter within an object for toolResponse.
    // The `sendMessage` parameter accepts a `GenerateContentParameters` object.
    // For tool responses, this object contains a `parts` array with a `functionResponse` object.
    const response = await activeChat.sendMessage({
      parts: [{
        functionResponse: {
          name: functionName,
          id: toolCallId,
          response: { result: result },
        },
      }],
    });
    console.log('Tool response sent, Gemini response:', response.text);
  } catch (error: any) {
    console.error('Error sending tool response:', error);
    onError(new Error(`Orbitto couldn't process the tool response. Please try again. (Details: ${error.message})`));
  }
};


export const explorePlacesWithGemini = async (
  prompt: string,
  location: UserLocation | null,
): Promise<{ text: string | undefined; groundingChunks: GroundingChunk[] }> => {
  try {
    const ai = getGeminiInstance();
    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (location) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        },
      };
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_EXPLORE_MODEL,
      contents: prompt,
      config: config,
    });

    // Fix: GroundingChunk type now aligned with @google/genai, so direct assignment is fine
    // The type definition in types.ts has been updated to match the expected structure.
    const groundingChunks: GroundingChunk[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      text: response.text,
      groundingChunks: groundingChunks,
    };
  } catch (error: any) {
    console.error('Error exploring places with Gemini:', error);
    throw new Error(`Failed to explore places with Orbitto. Please try adjusting your search. (Details: ${error.message})`);
  }
};


export const startLiveConversation = async (
  onTranscription: (text: string, isUser: boolean, isTurnComplete: boolean) => void,
  onAudioChunk: (audioBuffer: AudioBuffer) => void,
  onError: (error: ErrorEvent) => void,
  onClose: (event: CloseEvent) => void,
): Promise<Promise<any>> => {
  try {
    const ai = getGeminiInstance();
    const inputAudioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)({sampleRate: 16000}); // Added cross-browser compatibility
    
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (mediaError: any) {
      console.error('Microphone access denied or failed:', mediaError);
      // Create a custom ErrorEvent for consistency in the onError callback
      const customErrorEvent = new ErrorEvent('MediaStreamError', {
        message: `Microphone access denied. Please grant permission to use voice features. (Details: ${mediaError.message})`,
        error: mediaError
      });
      onError(customErrorEvent);
      return Promise.reject(customErrorEvent); // Reject the promise
    }

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: () => {
          console.debug('Live session opened');
          const source = inputAudioContext.createMediaStreamSource(stream);
          const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
            const pcmBlob = createBlob(inputData);
            sessionPromise.then((session) => {
              session.sendRealtimeInput({ media: pcmBlob });
            });
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(inputAudioContext.destination);
        },
        onmessage: async (message: LiveServerMessage) => {
          if (message.serverContent?.outputTranscription) {
            onTranscription(message.serverContent.outputTranscription.text, false, !!message.serverContent?.turnComplete);
          }
          if (message.serverContent?.inputTranscription) {
            onTranscription(message.serverContent.inputTranscription.text, true, !!message.serverContent?.turnComplete);
          }

          const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (base64EncodedAudioString) {
            nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
            const audioBuffer = await decodeAudioData(
              decode(base64EncodedAudioString),
              outputAudioContext,
              24000,
              1,
            );
            const source = outputAudioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputNode);
            source.addEventListener('ended', () => {
              sources.delete(source);
            });

            source.start(nextStartTime);
            nextStartTime = nextStartTime + audioBuffer.duration;
            sources.add(source);
            onAudioChunk(audioBuffer);
          }

          const interrupted = message.serverContent?.interrupted;
          if (interrupted) {
            for (const source of sources.values()) {
              source.stop();
              sources.delete(source);
            }
            nextStartTime = 0;
          }
        },
        onerror: (e: ErrorEvent) => {
          console.error('Live session error:', e);
          onError(e); // Propagate original error event
        },
        onclose: (e: CloseEvent) => {
          console.debug('Live session closed');
          onClose(e);
        },
      },
      config: {
        responseModalities: [Modality.AUDIO],
        outputAudioTranscription: {},
        inputAudioTranscription: {},
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
        },
      },
    });

    liveSessionPromise = sessionPromise;
    return sessionPromise;
  } catch (error: any) {
    console.error('Error starting live conversation:', error);
    const customErrorEvent = new ErrorEvent('LiveConnectError', {
      message: `Failed to start voice conversation with Orbitto. (Details: ${error.message})`,
      error: error
    });
    onError(customErrorEvent); // Use the common onError callback
    return Promise.reject(customErrorEvent); // Reject the promise
  }
};


export const stopLiveConversation = async () => {
  if (liveSessionPromise) {
    try {
      const session = await liveSessionPromise;
      if (session && typeof session.close === 'function') {
        session.close();
        console.debug('Live session explicitly closed via stopLiveConversation');
      }
    } catch (error: any) {
      console.error('Error closing live session:', error);
      // No need to propagate to UI for stop, just log
    } finally {
      liveSessionPromise = null;
      for (const source of sources.values()) {
        source.stop();
        sources.delete(source);
      }
      nextStartTime = 0;
    }
  }
};


// Fix: Use the custom GeminiMediaBlob interface as the return type
function createBlob(data: Float32Array): GeminiMediaBlob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  // Fix: Changed from Uint16Array to Int16Array for proper signed audio data decoding
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}