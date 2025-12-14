import React from 'react';

interface HeroSectionProps {
  onDiscoverClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onDiscoverClick }) => {
  return (
    <section 
      className="relative text-white py-20 px-4 md:py-32 text-center shadow-inner overflow-hidden min-h-[70vh] flex items-center justify-center" 
      style={{ 
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url('https://images.unsplash.com/photo-1501785888041-af3ba647888b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
      }}
    >
      {/* Subtle background pattern overlay */}
      <div className="absolute inset-0 z-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zm0 17v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0 17v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm-30 0v-4H4v4H0v2h4v4h2v-4h4v-2H6zm0-17v-4H4v4H0v2h4v4h2v-4h4v-2H6zm0-17v-4H4v4H0v2h4v4h2V6h4V4H6zm17 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-17v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-17v-4h-2v4h-4v2h4v4h2V6h4V4h-4z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")', backgroundSize: '20px 20px', animation: 'moveBackground 60s linear infinite' }}></div>
      <div className="container mx-auto relative z-10"> {/* Ensure content is above overlay */}
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight drop-shadow-lg">
          Uncover Hidden Gems, Experience the World with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-fuchsia-400">LocalXplore</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 font-light max-w-3xl mx-auto opacity-90">
          Your AI-powered guide to authentic, off-the-beaten-path experiences. Dive deeper than the tourist traps.
        </p>
        <button
          onClick={onDiscoverClick}
          className="bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white hover:from-blue-600 hover:to-fuchsia-600 px-8 py-3 rounded-full text-lg font-semibold shadow-xl transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
          aria-label="Start your adventure and discover global experiences"
        >
          Start Your Adventure
        </button>
      </div>
    </section>
  );
};

export default HeroSection;