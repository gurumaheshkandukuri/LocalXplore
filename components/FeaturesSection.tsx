import React from 'react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 p-6 flex flex-col items-center text-center transform hover:-translate-y-2 transition duration-300 ease-in-out group relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <i className={`${icon} text-5xl text-fuchsia-400 mb-4 relative z-10`}></i>
    <h3 className="text-xl font-bold text-white mb-3 relative z-10">{title}</h3>
    <p className="text-gray-300 relative z-10">{description}</p>
  </div>
);

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: 'fas fa-globe-americas',
      title: 'AI-Powered Global Discovery',
      description: 'Uncover hidden gems and authentic experiences tailored to your preferences, anywhere in the world.',
    },
    {
      icon: 'fas fa-users',
      title: 'Connect with Local Guides',
      description: 'Book verified local experts for unique tours, workshops, and immersive cultural interactions.',
    },
    {
      icon: 'fas fa-route',
      title: 'Personalized Itineraries',
      description: 'Let our AI craft custom travel plans, optimizing your journey for maximum enjoyment and discovery.',
    },
    {
      icon: 'fas fa-calendar-alt',
      title: 'Real-time Event Updates',
      description: 'Stay informed about local festivals, trending events, and must-see attractions happening now.',
    },
    {
      icon: 'fas fa-headset',
      title: 'Live AI Assistant',
      description: 'Get instant answers, recommendations, and assistance through our real-time voice chatbot.',
    },
    {
      icon: 'fas fa-seedling',
      title: 'Sustainable Travel Tips',
      description: 'Discover eco-friendly options and tips to minimize your environmental footprint while exploring.',
    },
  ];

  return (
    <section id="features" className="py-16 bg-gradient-to-br from-indigo-900 to-purple-900 text-gray-100 px-4" aria-labelledby="features-title">
      <div className="container mx-auto max-w-6xl">
        <h2 id="features-title" className="text-4xl md:text-5xl font-extrabold text-white mb-12 text-center">
          Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-fuchsia-400">LocalXplore</span>?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;