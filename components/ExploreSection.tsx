import React, { useState, useEffect, useCallback } from 'react';
import { Place, GroundingChunk, UserLocation, Festival, GuideBookingDetails } from '../types';
import { explorePlacesWithGemini } from '../services/geminiService';
import { PLACEHOLDER_IMAGE_URL } from '../constants';

interface ExploreSectionProps {
  onAddNotification: (message: string) => void;
  onBookGuide: (details: GuideBookingDetails) => void;
}

const ExploreSection: React.FC<ExploreSectionProps> = ({ onAddNotification, onBookGuide }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [groundingUris, setGroundingUris] = useState<GroundingChunk[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const predefinedFestivals: Festival[] = [
    {
      id: 'fest1',
      name: 'Jazz & Blues Fest',
      description: 'A vibrant festival celebrating jazz and blues music with local and international artists. Enjoy live performances, food stalls, and a lively atmosphere.',
      imageUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?q=80&w=2070&auto=format&fit=crop', 
      location: 'City Park Stage',
      date: 'July 20-22, 2024',
      uri: 'https://www.neworleans.com/things-to-do/festivals/jazz-fest/'
    },
    {
      id: 'fest2',
      name: 'Local Food Market',
      description: 'Experience local cuisine, fresh produce, and artisan goods at this bustling weekly market. Discover unique flavors and support local vendors.',
      imageUrl: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=2070&auto=format&fit=crop', 
      location: 'Downtown Square',
      date: 'Every Saturday',
      uri: 'https://www.visitseattle.org/things-to-do/markets/pike-place-market/'
    },
    {
      id: 'fest3',
      name: 'Summer Art Walk',
      description: 'An evening stroll showcasing local artists, galleries, and street performances. A perfect way to explore the vibrant arts scene.',
      imageUrl: 'https://images.unsplash.com/photo-1459908676235-d5f02a50184b?q=80&w=2070&auto=format&fit=crop', 
      location: 'Arts District',
      date: 'August 1-31, 2024',
      uri: 'https://www.denver.org/things-to-do/arts-culture/denver-art-walks/'
    },
  ];

  const fetchUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError(null);
          onAddNotification('Geolocation access granted!');
        },
        (err) => {
          console.warn(`ERROR(${err.code}): ${err.message}`);
          setLocationError('Unable to retrieve your location. Some features may be limited.');
          onAddNotification('Geolocation access denied. Some features may be limited.');
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
      onAddNotification('Geolocation is not supported by your browser.');
    }
  }, [onAddNotification]);

  useEffect(() => {
    fetchUserLocation();
  }, [fetchUserLocation]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    setPlaces([]);
    setGroundingUris([]);

    try {
      const prompt = `Find authentic, off-the-beaten-path experiences, hidden gems, and trending spots in or around "${searchTerm}". Also, mention any local festivals or unique events happening soon. Focus on cultural, culinary, or adventure opportunities.`;
      const { text: geminiResponse, groundingChunks } = await explorePlacesWithGemini(prompt, userLocation);

      if (geminiResponse) {
        const newPlaces: Place[] = [];
        const lines = geminiResponse.split('\n').filter(line => line.trim() !== '');

        lines.forEach((line, index) => {
          const match = line.match(/^(.*?): (.*?) \((.*?)\)$/);
          if (match) {
            newPlaces.push({
              id: `gemini-place-${index}`,
              name: match[1].trim(),
              description: match[2].trim(),
              category: match[3].trim(),
              imageUrl: `${PLACEHOLDER_IMAGE_URL}?${Math.random()}`,
              rating: parseFloat((Math.random() * (5.0 - 3.0) + 3.0).toFixed(1)),
              trendingScore: Math.floor(Math.random() * 100),
            });
          } else {
            newPlaces.push({
              id: `gemini-text-${index}`,
              name: `Recommendation ${index + 1}`,
              description: line.trim(),
              category: 'General',
              imageUrl: `${PLACEHOLDER_IMAGE_URL}?${Math.random()}`,
              rating: 0,
              trendingScore: 0,
            });
          }
        });
        setPlaces(newPlaces);
      } else {
        setPlaces([{
          id: 'no-results',
          name: 'No specific places found',
          description: 'Gemini provided a general response.',
          category: 'Info',
          imageUrl: `${PLACEHOLDER_IMAGE_URL}?${Math.random()}`,
          rating: 0,
          trendingScore: 0,
        }]);
      }
      setGroundingUris(groundingChunks);

    } catch (err: any) {
      setError(err.message || 'Failed to fetch experiences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookGuide = (place: Place) => {
    const bookingDetails: GuideBookingDetails = {
      guideName: 'Local Expert',
      activity: `${place.name} Discovery`,
      date: 'Flexible',
      time: 'Flexible',
      price: 75 + Math.floor(Math.random() * 50),
    };
    onBookGuide(bookingDetails);
    onAddNotification(`Initiating guide booking for "${place.name}".`);
  };


  return (
    <section id="explore" className="py-16 bg-gradient-to-br from-gray-900 to-slate-900 px-4 text-gray-100" aria-labelledby="explore-title">
      <div className="container mx-auto max-w-6xl">
        <h2 id="explore-title" className="text-4xl md:text-5xl font-extrabold text-white mb-8 text-center">
          Explore Unique Global Experiences
        </h2>

        {locationError && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative mb-6 animate-fade-in" role="alert">
            <strong className="font-bold">Location Error!</strong>
            <span className="block sm:inline"> {locationError}</span>
            <button
              onClick={() => setLocationError(null)}
              className="absolute top-0 bottom-0 right-0 px-4 py-3 text-red-400 hover:text-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full"
              aria-label="Dismiss location error"
            >
              <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.03a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.15a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.03a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.15 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </button>
          </div>
        )}

        <form onSubmit={handleSearch} className="mb-10 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            className="flex-grow p-4 border border-gray-700 bg-gray-950 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition duration-300 text-gray-100 placeholder-gray-400"
            placeholder="Search for a city, region, or specific experience (e.g., 'Tokyo hidden cafes')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
            aria-label="Search for experiences"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-fuchsia-600 hover:from-blue-700 hover:to-fuchsia-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transform hover:scale-105 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500"
            disabled={loading || !searchTerm.trim()}
            aria-label={loading ? 'Searching...' : 'Search Experiences'}
          >
            {loading ? 'Searching...' : 'Search Experiences'}
          </button>
        </form>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative mb-6 animate-fade-in" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {groundingUris.length > 0 && (
          <div className="mb-10 p-6 bg-blue-900/50 border-l-4 border-blue-600 text-blue-100 rounded-lg shadow-md animate-fade-in" aria-label="Information sources">
            <h3 className="font-bold text-xl mb-3 flex items-center">
              <i className="fas fa-info-circle text-blue-400 mr-3"></i> Sources from Google:
            </h3>
            <ul className="list-disc list-inside space-y-2">
              {groundingUris.map((chunk, index) => {
                const mapUri = chunk.maps?.uri;
                const mapTitle = chunk.maps?.title;
                const reviewSnippets = chunk.maps?.placeAnswerSources?.reviewSnippets || [];
                const webUri = chunk.web?.uri;
                const webTitle = chunk.web?.title;

                return (
                  <li key={index} className="flex flex-col">
                    {mapUri && mapTitle && (
                      <a href={mapUri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline font-medium text-lg flex items-center" aria-label={`View ${mapTitle} on Google Maps`}>
                        <i className="fas fa-map-marker-alt mr-2 text-blue-300"></i> {mapTitle} (Maps)
                      </a>
                    )}
                    {webUri && webTitle && (
                      <a href={webUri} target="_blank" rel="noopener noreferrer" className="text-fuchsia-400 hover:underline font-medium text-lg flex items-center mt-1" aria-label={`Visit ${webTitle} website`}>
                        <i className="fas fa-globe mr-2 text-fuchsia-300"></i> {webTitle} (Web)
                      </a>
                    )}
                    {reviewSnippets && reviewSnippets.length > 0 && (
                      <ul className="list-disc list-inside ml-8 text-sm text-gray-300 space-y-1 mt-2">
                        {reviewSnippets.map((snippet, sIdx) => (
                          <li key={`review-${sIdx}`}>"{snippet.text}"</li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Search Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {places.length === 0 && !loading && (
            <p className="text-center text-gray-400 col-span-full py-8 text-lg italic">
              No specific places found yet. Try searching for "Paris hidden cafes" or "Hiking trails near Tokyo" to get started!
            </p>
          )}

          {places.map((place) => (
            <div key={place.id} className="relative bg-white/5 rounded-xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:-translate-y-1 transition duration-300 ease-in-out group border border-white/10 backdrop-blur-md" role="article" aria-labelledby={`place-name-${place.id}`}>
              <img src={place.imageUrl || PLACEHOLDER_IMAGE_URL} alt={place.name} className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
              <div className="p-6 text-gray-100">
                <h3 id={`place-name-${place.id}`} className="text-2xl font-bold mb-2">{place.name}</h3>
                <p className="text-fuchsia-400 text-sm font-medium mb-3 flex items-center"><i className="fas fa-tag mr-2 opacity-70"></i>{place.category}</p>
                <p className="text-gray-300 text-base mb-4 line-clamp-3">{place.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-400 mt-4">
                  <span className="flex items-center">
                    <i className="fas fa-star text-yellow-400 mr-1"></i> {place.rating > 0 ? place.rating.toFixed(1) : 'N/A'}
                  </span>
                  <span className="flex items-center">
                    <i className="fas fa-chart-line text-emerald-400 mr-1"></i> Trending: {place.trendingScore}%
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-5">
                  {place.uri && (
                    <a
                      href={place.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-fuchsia-600 hover:from-blue-700 hover:to-fuchsia-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500"
                      aria-label={`Learn more about ${place.name}`}
                    >
                      Learn More <i className="fas fa-arrow-right ml-2 text-sm"></i>
                    </a>
                  )}
                  <button
                    onClick={() => handleBookGuide(place)}
                    className="inline-flex items-center justify-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    aria-label={`Book a guide for ${place.name}`}
                  >
                    Book Guide <i className="fas fa-calendar-check ml-2 text-sm"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Separate Festivals Section */}
        <div className="mt-16 pt-12 border-t border-white/10">
          <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-10 text-center" id="upcoming-festivals-title">
            Upcoming Local Festivals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {predefinedFestivals.map((festival) => (
              <div key={festival.id} className="relative bg-white/5 rounded-xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:-translate-y-1 transition duration-300 ease-in-out group border border-white/10 backdrop-blur-md flex flex-col h-full" role="article" aria-labelledby={`festival-name-${festival.id}`}>
                <img src={festival.imageUrl} alt={`Image for ${festival.name} festival`} className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                <div className="p-6 text-gray-100 flex flex-col flex-grow">
                  <h4 id={`festival-name-${festival.id}`} className="text-2xl font-bold mb-2">{festival.name}</h4>
                  <p className="text-blue-400 text-sm font-medium mb-3 flex items-center"><i className="fas fa-calendar-alt mr-2 text-blue-300"></i>{festival.date}</p>
                  <p className="text-gray-300 text-base mb-4 flex-grow">{festival.description}</p>
                  {festival.uri && (
                    <a
                      href={festival.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-fuchsia-600 hover:from-blue-700 hover:to-fuchsia-700 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out mt-auto w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500"
                      aria-label={`Get details for ${festival.name}`}
                    >
                      View Details <i className="fas fa-external-link-alt ml-2 text-sm"></i>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreSection;