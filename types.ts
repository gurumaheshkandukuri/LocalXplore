
export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
  isThinking?: boolean;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface GroundingChunk {
  web?: { uri?: string; title?: string };
  maps?: { uri?: string; title?: string; placeAnswerSources?: { reviewSnippets?: { text: string; uri?: string; }[] } };
}

export interface Place {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  rating: number;
  trendingScore: number;
  location?: string;
  uri?: string;
}

export interface Festival {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
  uri?: string;
}

export interface GuideBookingDetails {
  guideName: string;
  activity: string;
  date: string;
  time: string;
  price: number;
}

export interface Itinerary {
  id: string;
  name: string;
  duration: string; // e.g., "3 days", "Full day"
  description: string;
  places: string[]; // Names of places to visit
  activities: string[]; // Activities to do
  imageUrl?: string;
}