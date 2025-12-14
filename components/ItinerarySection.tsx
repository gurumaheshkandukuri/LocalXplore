import React from 'react';
import { Itinerary, GuideBookingDetails } from '../types';
import { PLACEHOLDER_IMAGE_URL } from '../constants';

interface ItinerarySectionProps {
  itineraries: Itinerary[];
  onAddNotification: (message: string) => void;
  onOpenItineraryForm: () => void; // Replaced onScrollToChatbot and onTriggerChatPrompt
  onBookGuide: (details: GuideBookingDetails) => void;
}

const ItinerarySection: React.FC<ItinerarySectionProps> = ({ itineraries, onAddNotification, onOpenItineraryForm, onBookGuide }) => {

  const predefinedItineraries: Itinerary[] = [
    {
      id: 'itn1',
      name: 'Historical Rome Adventure',
      duration: '4 days',
      description: 'Explore the ancient wonders of Rome, from the Colosseum to the Vatican City, with a mix of historical tours and authentic Italian cuisine.',
      places: ['Colosseum', 'Roman Forum', 'Vatican City', 'Trevi Fountain', 'Pantheon'],
      activities: ['Guided history tour', 'Pasta making class', 'Gelato tasting', 'Evening strolls'],
      imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' // Colosseum Unsplash
    },
    {
      id: 'itn2',
      name: 'Bali Spiritual Retreat',
      duration: '7 days',
      description: 'A week-long journey through Bali\'s serene landscapes, focusing on wellness, culture, and relaxation.',
      places: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Uluwatu Temple', 'Seminyak Beach'],
      activities: ['Yoga and meditation', 'Balinese cooking class', 'Surf lessons', 'Spa treatments', 'Traditional dance show'],
      imageUrl: 'https://images.unsplash.com/photo-1558004246-81413a070183?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' 
    },
    {
      id: 'itn3',
      name: 'Kyoto Cherry Blossom Trail',
      duration: '3 days',
      description: 'Immerse yourself in the breathtaking beauty of Kyoto during cherry blossom season, visiting temples, gardens, and traditional tea houses.',
      places: ['Kinkaku-ji (Golden Pavilion)', 'Arashiyama Bamboo Grove', 'Fushimi Inari-taisha', 'Gion District'],
      activities: ['Tea ceremony', 'Kimono rental', 'Zen garden meditation', 'Night photography'],
      imageUrl: 'https://images.unsplash.com/photo-1550746977-fa242e20b8e7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      id: 'itn4',
      name: 'Vizag Coastal Escape',
      duration: '3 days',
      description: 'Discover the scenic beauty and rich naval history of Visakhapatnam (Vizag) with its pristine beaches, ancient caves, and delicious seafood.',
      places: ['Ramakrishna Beach', 'Kailasagiri Hill Park', 'Borra Caves', 'Submarine Museum', 'Rushikonda Beach'],
      activities: ['Beach hopping', 'Cable car ride', 'Cave exploration', 'Seafood tasting', 'Sunset views'],
      imageUrl: 'https://images.unsplash.com/photo-1629864222047-920f32b8e390?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' 
    },
    {
      id: 'itn5',
      name: 'Hyderabad Cultural Journey',
      duration: '4 days',
      description: 'Immerse yourself in the royal legacy of Hyderabad, the City of Pearls, with its magnificent forts, opulent palaces, and world-renowned biryani.',
      places: ['Charminar', 'Golconda Fort', 'Qutb Shahi Tombs', 'Chowmahalla Palace', 'Ramoji Film City'],
      activities: ['Heritage walk', 'Bangle shopping', 'Biryani tasting', 'Sound & Light show', 'Movie studio tour'],
      imageUrl: 'https://images.unsplash.com/photo-1599307993466-93d395a12d8a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' 
    },
    {
      id: 'itn6',
      name: 'Mumbai City of Dreams',
      duration: '3 days',
      description: 'Experience the bustling energy of Mumbai, India\'s financial and entertainment capital. Explore iconic landmarks, vibrant markets, and rich colonial history.',
      places: ['Gateway of India', 'Marine Drive', 'Chhatrapati Shivaji Maharaj Vastu Sangrahalaya', 'Dharavi Slum', 'Colaba Causeway'],
      activities: ['Bollywood tour', 'Street food crawl', 'Shopping', 'Ferry ride', 'Nightlife exploration'],
      imageUrl: 'https://images.unsplash.com/photo-1596765796030-80a588b3f114?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' 
    },
    {
      id: 'itn7',
      name: 'Goa Beach & Party',
      duration: '4 days',
      description: 'Unwind on the sun-kissed beaches of Goa, famed for its vibrant nightlife, Portuguese heritage, and laid-back atmosphere. Perfect for relaxation and revelry.',
      places: ['Baga Beach', 'Anjuna Flea Market', 'Dudhsagar Falls', 'Old Goa Churches', 'Palolem Beach'],
      activities: ['Watersports', 'Party hopping', 'Spice plantation tour', 'Sunset cruise', 'Yoga on the beach'],
      imageUrl: 'https://images.unsplash.com/photo-1579758782334-0a370e7b7e80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' 
    },
  ];

  const allItineraries = [...predefinedItineraries, ...itineraries];

  const handleGenerateClick = () => {
    onOpenItineraryForm(); // Open the new itinerary form modal
  };

  const handleBookGuideForItinerary = (itinerary: Itinerary) => {
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
            <div key={itinerary.id} className="relative bg-white/5 rounded-xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:-translate-y-1 transition duration-300 ease-in-out group border border-white/10 backdrop-blur-md flex flex-col" role="article" aria-labelledby={`itinerary-name-${itinerary.id}`}>
              <img src={itinerary.imageUrl || PLACEHOLDER_IMAGE_URL} alt={`Image for ${itinerary.name} itinerary`} className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
              <div className="p-6 text-gray-100 flex flex-col flex-grow">
                <h3 id={`itinerary-name-${itinerary.id}`} className="text-2xl font-bold mb-2">{itinerary.name}</h3>
                <p className="text-blue-400 text-sm font-medium mb-3 flex items-center"><i className="fas fa-clock mr-2 text-blue-300"></i>{itinerary.duration}</p>
                <p className="text-gray-300 text-base mb-4 line-clamp-3">{itinerary.description}</p>
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-200 mb-2 flex items-center"><i className="fas fa-map-marker-alt mr-2 text-fuchsia-400"></i>Places:</h4>
                  <ul className="list-disc list-inside text-gray-300 text-sm space-y-1 pl-2 max-h-20 overflow-y-auto custom-scrollbar-itinerary">
                    {itinerary.places.map((place, idx) => <li key={idx}>{place}</li>)}
                  </ul>
                </div>
                <div className="mt-4 mb-4">
                  <h4 className="font-semibold text-gray-200 mb-2 flex items-center"><i className="fas fa-hiking mr-2 text-emerald-400"></i>Activities:</h4>
                  <ul className="list-disc list-inside text-gray-300 text-sm space-y-1 pl-2 max-h-20 overflow-y-auto custom-scrollbar-itinerary">
                    {itinerary.activities.map((activity, idx) => <li key={idx}>{activity}</li>)}
                  </ul>
                </div>
                <button
                  onClick={() => handleBookGuideForItinerary(itinerary)}
                  className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-gray-900 font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out mt-auto w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
                  aria-label={`Book a guide for ${itinerary.name} itinerary`}
                >
                  Book a Guide <i className="fas fa-user-friends ml-2 text-sm"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ItinerarySection;