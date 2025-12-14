import React, { useState } from 'react';
import { Itinerary, GuideBookingDetails } from '../types';
import { PLACEHOLDER_IMAGE_URL } from '../constants';

interface ItinerarySectionProps {
  itineraries: Itinerary[];
  onAddNotification: (message: string) => void;
  onOpenItineraryForm: () => void;
  onBookGuide: (details: GuideBookingDetails) => void;
}

const ItinerarySection: React.FC<ItinerarySectionProps> = ({ itineraries, onAddNotification, onOpenItineraryForm, onBookGuide }) => {
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);

  const predefinedItineraries: Itinerary[] = [
    {
      id: 'itn1',
      name: 'Historical Rome Adventure',
      duration: '4 days',
      description: 'Explore the ancient wonders of Rome, from the Colosseum to the Vatican City, with a mix of historical tours and authentic Italian cuisine.',
      places: ['Colosseum', 'Roman Forum', 'Vatican City', 'Trevi Fountain', 'Pantheon'],
      activities: ['Guided history tour', 'Pasta making class', 'Gelato tasting', 'Evening strolls'],
      imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop'
    },
    {
      id: 'itn2',
      name: 'Bali Spiritual Retreat',
      duration: '7 days',
      description: 'A week-long journey through Bali\'s serene landscapes, focusing on wellness, culture, and relaxation.',
      places: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Uluwatu Temple', 'Seminyak Beach'],
      activities: ['Yoga and meditation', 'Balinese cooking class', 'Surf lessons', 'Spa treatments', 'Traditional dance show'],
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2076&auto=format&fit=crop'
    },
    {
      id: 'itn3',
      name: 'Kyoto Cherry Blossom Trail',
      duration: '3 days',
      description: 'Immerse yourself in the breathtaking beauty of Kyoto during cherry blossom season, visiting temples, gardens, and traditional tea houses.',
      places: ['Kinkaku-ji (Golden Pavilion)', 'Arashiyama Bamboo Grove', 'Fushimi Inari-taisha', 'Gion District'],
      activities: ['Tea ceremony', 'Kimono rental', 'Zen garden meditation', 'Night photography'],
      imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 'itn4',
      name: 'Vizag Coastal Escape',
      duration: '3 days',
      description: 'Discover the scenic beauty and rich naval history of Visakhapatnam (Vizag) with its pristine beaches, ancient caves, and delicious seafood.',
      places: ['Ramakrishna Beach', 'Kailasagiri Hill Park', 'Borra Caves', 'Submarine Museum', 'Rushikonda Beach'],
      activities: ['Beach hopping', 'Cable car ride', 'Cave exploration', 'Seafood tasting', 'Sunset views'],
      imageUrl: 'https://images.unsplash.com/photo-1598964724949-5991807604c5?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 'itn5',
      name: 'Hyderabad Cultural Journey',
      duration: '4 days',
      description: 'Immerse yourself in the royal legacy of Hyderabad, the City of Pearls, with its magnificent forts, opulent palaces, and world-renowned biryani.',
      places: ['Charminar', 'Golconda Fort', 'Qutb Shahi Tombs', 'Chowmahalla Palace', 'Ramoji Film City'],
      activities: ['Heritage walk', 'Bangle shopping', 'Biryani tasting', 'Sound & Light show', 'Movie studio tour'],
      imageUrl: 'https://images.unsplash.com/photo-1572508589584-94d778209083?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 'itn6',
      name: 'Mumbai City of Dreams',
      duration: '3 days',
      description: 'Experience the bustling energy of Mumbai, India\'s financial and entertainment capital. Explore iconic landmarks, vibrant markets, and rich colonial history.',
      places: ['Gateway of India', 'Marine Drive', 'Chhatrapati Shivaji Maharaj Vastu Sangrahalaya', 'Dharavi Slum', 'Colaba Causeway'],
      activities: ['Bollywood tour', 'Street food crawl', 'Shopping', 'Ferry ride', 'Nightlife exploration'],
      imageUrl: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=2100&auto=format&fit=crop'
    },
    {
      id: 'itn7',
      name: 'Goa Beach & Party',
      duration: '4 days',
      description: 'Unwind on the sun-kissed beaches of Goa, famed for its vibrant nightlife, Portuguese heritage, and laid-back atmosphere. Perfect for relaxation and revelry.',
      places: ['Baga Beach', 'Anjuna Flea Market', 'Dudhsagar Falls', 'Old Goa Churches', 'Palolem Beach'],
      activities: ['Watersports', 'Party hopping', 'Spice plantation tour', 'Sunset cruise', 'Yoga on the beach'],
      imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1974&auto=format&fit=crop'
    },
  ];

  const allItineraries = [...predefinedItineraries, ...itineraries];

  const handleGenerateClick = () => {
    onOpenItineraryForm();
  };

  const handleBookGuideForItinerary = (itinerary: Itinerary, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const bookingDetails: GuideBookingDetails = {
      guideName: 'Itinerary Specialist',
      activity: `${itinerary.name} Tour`,
      date: 'Choose Date',
      time: 'Full Day',
      price: 150 + Math.floor(Math.random() * 100),
    };
    onBookGuide(bookingDetails);
    onAddNotification(`Initiating guide booking for your "${itinerary.name}" itinerary.`);
  };

  return (
    <section id="itineraries" className="py-16 bg-gradient-to-br from-gray-900 to-slate-900 px-4 text-gray-100" aria-labelledby="itineraries-title">
      <div className="container mx-auto max-w-6xl">
        <h2 id="itineraries-title" className="text-4xl md:text-5xl font-extrabold text-white mb-8 text-center">
          Curated Travel Itineraries
        </h2>
        <p className="text-lg text-gray-300 text-center mb-12 max-w-2xl mx-auto">
          Discover meticulously planned trips or let our AI assistant craft a personalized itinerary just for you.
        </p>

        <div className="text-center mb-12">
          <button
            onClick={handleGenerateClick}
            className="bg-gradient-to-r from-blue-600 to-fuchsia-600 hover:from-blue-700 hover:to-fuchsia-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 text-lg"
            aria-label="Generate new itinerary with AI"
          >
            <i className="fas fa-magic mr-3"></i> Generate New Itinerary with AI
          </button>
        </div>

        {allItineraries.length === 0 && (
          <p className="text-center text-gray-400 col-span-full py-8 text-lg italic">
            No itineraries found yet. Click the button above to generate your first one!
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allItineraries.map((itinerary) => (
            <div 
              key={itinerary.id} 
              onClick={() => setSelectedItinerary(itinerary)}
              className="relative bg-white/5 rounded-xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:-translate-y-1 transition duration-300 ease-in-out group border border-white/10 backdrop-blur-md flex flex-col cursor-pointer" 
              role="article" 
              aria-labelledby={`itinerary-name-${itinerary.id}`}
            >
              <div className="relative overflow-hidden">
                 <img src={itinerary.imageUrl || PLACEHOLDER_IMAGE_URL} alt={`Image for ${itinerary.name} itinerary`} className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                 <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                    Click to view details
                 </div>
              </div>
              
              <div className="p-6 text-gray-100 flex flex-col flex-grow">
                <h3 id={`itinerary-name-${itinerary.id}`} className="text-2xl font-bold mb-2">{itinerary.name}</h3>
                <p className="text-blue-400 text-sm font-medium mb-3 flex items-center"><i className="fas fa-clock mr-2 text-blue-300"></i>{itinerary.duration}</p>
                <p className="text-gray-300 text-base mb-4 line-clamp-3">{itinerary.description}</p>
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-200 mb-2 flex items-center"><i className="fas fa-map-marker-alt mr-2 text-fuchsia-400"></i>Places:</h4>
                  <ul className="list-disc list-inside text-gray-300 text-sm space-y-1 pl-2 max-h-20 overflow-y-auto custom-scrollbar-itinerary">
                    {itinerary.places.slice(0, 3).map((place, idx) => <li key={idx}>{place}</li>)}
                    {itinerary.places.length > 3 && <li className="text-gray-400 italic">+{itinerary.places.length - 3} more...</li>}
                  </ul>
                </div>
                <div className="mt-4 mb-4">
                  <h4 className="font-semibold text-gray-200 mb-2 flex items-center"><i className="fas fa-hiking mr-2 text-emerald-400"></i>Activities:</h4>
                  <ul className="list-disc list-inside text-gray-300 text-sm space-y-1 pl-2 max-h-20 overflow-y-auto custom-scrollbar-itinerary">
                    {itinerary.activities.slice(0, 3).map((activity, idx) => <li key={idx}>{activity}</li>)}
                    {itinerary.activities.length > 3 && <li className="text-gray-400 italic">+{itinerary.activities.length - 3} more...</li>}
                  </ul>
                </div>
                <button
                  onClick={(e) => handleBookGuideForItinerary(itinerary, e)}
                  className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-gray-900 font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out mt-auto w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
                  aria-label={`Book a guide for ${itinerary.name} itinerary`}
                >
                  Book a Guide <i className="fas fa-user-friends ml-2 text-sm"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Expanded Itinerary Details */}
        {selectedItinerary && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedItinerary(null)}>
            <div 
              className="bg-gray-900 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl border border-gray-700 animate-slide-up" 
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header Image */}
              <div className="relative h-64 md:h-96">
                <img src={selectedItinerary.imageUrl || PLACEHOLDER_IMAGE_URL} alt={selectedItinerary.name} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setSelectedItinerary(null)} 
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition focus:outline-none focus:ring-2 focus:ring-white z-10"
                  aria-label="Close details"
                >
                  <i className="fas fa-times text-xl w-8 h-8 flex items-center justify-center"></i>
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-md">{selectedItinerary.name}</h2>
                  <p className="text-blue-300 text-xl font-medium drop-shadow-md flex items-center">
                    <i className="fas fa-clock mr-2"></i> {selectedItinerary.duration}
                  </p>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 md:p-10 space-y-10">
                <div className="text-gray-300 text-lg leading-relaxed border-l-4 border-fuchsia-500 pl-4">
                   {selectedItinerary.description}
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  {/* Left Column: Details */}
                  <div className="space-y-8">
                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <i className="fas fa-map-marked-alt text-fuchsia-400 mr-3"></i> Places to Visit
                      </h3>
                      <ul className="space-y-3">
                        {selectedItinerary.places.map((place, idx) => (
                          <li key={idx} className="flex items-start text-gray-300">
                            <i className="fas fa-check-circle text-fuchsia-500 mt-1 mr-3 flex-shrink-0"></i>
                            <span>{place}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                         <i className="fas fa-running text-emerald-400 mr-3"></i> Activities
                      </h3>
                      <ul className="space-y-3">
                        {selectedItinerary.activities.map((activity, idx) => (
                          <li key={idx} className="flex items-start text-gray-300">
                             <i className="fas fa-star text-emerald-500 mt-1 mr-3 flex-shrink-0"></i>
                             <span>{activity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Column: Visuals & Resources */}
                  <div className="space-y-8">
                    {/* Map Placeholder */}
                    <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg">
                      <div className="bg-gray-700 px-4 py-3 border-b border-gray-600 flex justify-between items-center">
                        <span className="font-semibold text-gray-200">Trip Overview Map</span>
                        <i className="fas fa-map text-gray-400"></i>
                      </div>
                      <div className="relative h-64 bg-gray-800 flex items-center justify-center group overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1748&auto=format&fit=crop" 
                          alt="Map View Placeholder" 
                          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                        <button className="absolute bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-2 rounded-full font-semibold transition-all transform hover:scale-105 flex items-center shadow-lg">
                          <i className="fas fa-external-link-alt mr-2"></i> Open Interactive Map
                        </button>
                      </div>
                    </div>

                    {/* Related Resources */}
                    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
                      <h3 className="text-xl font-bold text-white mb-4">Travel Resources & Tips</h3>
                      <ul className="space-y-4">
                        <li>
                          <a href="#" className="flex items-center p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition group" onClick={e => e.preventDefault()}>
                            <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              <i className="fas fa-book-open"></i>
                            </div>
                            <div>
                              <p className="text-gray-200 font-medium group-hover:text-white">Travel Guide: {selectedItinerary.name.split(' ')[0]}</p>
                              <p className="text-xs text-gray-500">5 min read • Local customs</p>
                            </div>
                          </a>
                        </li>
                        <li>
                           <a href="#" className="flex items-center p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition group" onClick={e => e.preventDefault()}>
                            <div className="w-10 h-10 rounded-full bg-fuchsia-900/50 flex items-center justify-center text-fuchsia-400 mr-4 group-hover:bg-fuchsia-600 group-hover:text-white transition-colors">
                              <i className="fas fa-camera"></i>
                            </div>
                            <div>
                              <p className="text-gray-200 font-medium group-hover:text-white">Best Photo Spots</p>
                              <p className="text-xs text-gray-500">Gallery • 15 Locations</p>
                            </div>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-gray-400 text-sm">
                    <i className="fas fa-info-circle mr-2"></i> Prices vary based on season and group size.
                  </div>
                  <button
                    onClick={(e) => {
                      handleBookGuideForItinerary(selectedItinerary, e);
                      setSelectedItinerary(null);
                    }}
                    className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-gray-900 font-bold py-4 px-10 rounded-full shadow-lg transform hover:scale-105 transition duration-300 flex items-center justify-center text-lg"
                  >
                    <span>Book This Trip Now</span>
                    <i className="fas fa-arrow-right ml-3"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ItinerarySection;