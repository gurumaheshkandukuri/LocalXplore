import { FunctionDeclaration, Type } from '@google/genai';

export const GEMINI_CHAT_MODEL = 'gemini-2.5-flash';
export const GEMINI_EXPLORE_MODEL = 'gemini-2.5-flash'; // For explore features with grounding
export const PLACEHOLDER_IMAGE_URL = 'https://picsum.photos/400/300';

export const BOOK_GUIDE_FUNCTION_NAME = 'bookTravelGuide';
export const CREATE_ITINERARY_FUNCTION_NAME = 'createItinerary';

export const bookTravelGuideFunctionDeclaration: FunctionDeclaration = {
  name: BOOK_GUIDE_FUNCTION_NAME,
  parameters: {
    type: Type.OBJECT,
    description: 'Books a travel guide for a specific activity, date, and time.',
    properties: {
      guideName: {
        type: Type.STRING,
        description: 'The name of the travel guide to book.',
      },
      activity: {
        type: Type.STRING,
        description: 'The activity to book with the guide (e.g., historical tour, food tasting, hiking).',
      },
      date: {
        type: Type.STRING,
        description: 'The desired date for the booking (e.g., "tomorrow", "August 15th").',
      },
      time: {
        type: Type.STRING,
        description: 'The desired time for the booking (e.g., "2 PM", "morning").',
      },
      price: {
        type: Type.NUMBER,
        description: 'The price for the guide service in USD.',
      },
    },
    required: ['guideName', 'activity', 'date', 'time', 'price'],
  },
};

export const createItineraryFunctionDeclaration: FunctionDeclaration = {
  name: CREATE_ITINERARY_FUNCTION_NAME,
  parameters: {
    type: Type.OBJECT,
    description: 'Creates a travel itinerary based on user preferences, including duration, places to visit, and activities.',
    properties: {
      name: {
        type: Type.STRING,
        description: 'A descriptive name for the itinerary (e.g., "Romantic Paris Getaway").',
      },
      duration: {
        type: Type.STRING,
        description: 'The duration of the itinerary (e.g., "3 days", "Full day", "Weekend").',
      },
      description: {
        type: Type.STRING,
        description: 'A brief description of the itinerary.',
      },
      places: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'A list of key places to visit in the itinerary.',
      },
      activities: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'A list of activities planned for the itinerary.',
      },
    },
    required: ['name', 'duration', 'description', 'places', 'activities'],
  },
};