import React from 'react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  location: string;
  avatar: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author, location, avatar }) => (
  <div className="flex-shrink-0 w-80 md:w-96 p-6 bg-gray-800 rounded-xl shadow-xl shadow-gray-950/50 relative overflow-hidden
              before:absolute before:inset-0 before:rounded-xl before:shadow-inner-xl before:shadow-gray-700/50
              transform hover:scale-105 transition duration-300 ease-in-out group">
    <div className="flex items-center mb-4">
      <img src={avatar} alt={`Avatar of ${author}`} className="w-12 h-12 rounded-full mr-4 border-2 border-fuchsia-500 shadow-md" />
      <div>
        <h3 className="text-lg font-bold text-white group-hover:text-fuchsia-400 transition-colors duration-200">{author}</h3>
        <p className="text-sm text-gray-400">{location}</p>
      </div>
    </div>
    <p className="text-gray-200 italic mb-4">"{quote}"</p>
    <div className="text-yellow-400">
      <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star-half-alt"></i>
    </div>
  </div>
);

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "LocalXplore transformed my trip to Kyoto! I found a hidden tea house and a local artisan workshop that no guide book mentioned. Truly authentic!",
      author: "Anya Sharma",
      location: "Explorer from Canada",
      avatar: "https://picsum.photos/id/1025/60/60",
    },
    {
      quote: "The AI assistant for booking a guide was seamless. Our guide in Rome was incredible, bringing history to life. Highly recommend LocalXplore!",
      author: "Marco Rossi",
      location: "Traveler from Italy",
      avatar: "https://picsum.photos/id/1012/60/60",
    },
    {
      quote: "Finally, a travel app that gets it! I loved the personalized itinerary for my Bali retreat. Every recommendation felt hand-picked.",
      author: "Chloe Dubois",
      location: "Wellness Enthusiast from France",
      avatar: "https://picsum.photos/id/1011/60/60",
    },
    {
      quote: "The real-time event updates led me to an amazing jazz festival in Berlin. LocalXplore truly helps you live like a local.",
      author: "David Chen",
      location: "Music Lover from USA",
      avatar: "https://picsum.photos/id/1005/60/60",
    },
    {
      quote: "Using LocalXplore felt like having a local friend everywhere I went. The tips on sustainable travel were a bonus!",
      author: "Sofia Rodriguez",
      location: "Eco-Conscious Traveler from Spain",
      avatar: "https://picsum.photos/id/1027/60/60",
    },
  ];

  return (
    <section id="testimonials" className="py-16 bg-gradient-to-br from-purple-900 to-fuchsia-900 text-gray-100 px-4" aria-labelledby="testimonials-title">
      <div className="container mx-auto max-w-7xl">
        <h2 id="testimonials-title" className="text-4xl md:text-5xl font-extrabold text-white mb-12 text-center">
          What Our Travelers Say
        </h2>
        {/* Static horizontal scroll to showcase neumorphism cards */}
        <div className="flex overflow-x-auto space-x-8 pb-4 custom-scrollbar-itinerary snap-x snap-mandatory">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="snap-center">
              <TestimonialCard {...testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;