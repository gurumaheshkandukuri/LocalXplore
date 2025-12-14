import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 bg-gradient-to-br from-blue-900 to-indigo-900 text-gray-100 px-4" aria-labelledby="about-title">
      <div className="container mx-auto max-w-6xl">
        <h2 id="about-title" className="text-4xl md:text-5xl font-extrabold text-white mb-12 text-center">
          What is <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-fuchsia-400">LocalXplore</span>?
        </h2>
        <div className="flex flex-col items-center">
          {/* Removed image div entirely */}
          <div className="w-full"> {/* Adjusted to full width */}
            <p className="text-lg leading-relaxed mb-6 text-gray-200">
              LocalXplore is your cutting-edge AI-powered companion designed to revolutionize how you explore the world. We go beyond typical tourist guides, offering deeply authentic and off-the-beaten-path experiences curated just for you.
            </p>
            <p className="text-lg leading-relaxed mb-6 text-gray-200">
              Leveraging advanced AI, LocalXplore understands your preferences, adapts to your travel style, and connects you with passionate local guides who can unveil the true essence of any destination. From hidden culinary gems to ancient, rarely-visited ruins, we ensure every journey is unique and unforgettable.
            </p>
            <p className="text-lg leading-relaxed text-gray-200">
              Stay updated on local festivals, events, and trending spots in real-time. With LocalXplore, you're not just visiting a place; you're immersing yourself in its culture, connecting with its people, and experiencing it through a truly local lens.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;