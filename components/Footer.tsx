import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 text-white py-6 px-4 shadow-inner" role="contentinfo">
      <div className="container mx-auto text-center">
        <p className="text-sm opacity-90">
          &copy; {new Date().getFullYear()} LocalXplore. All rights reserved.
        </p>
        <p className="text-xs mt-2 opacity-80">
          Powered by Gemini AI for enhanced global exploration.
        </p>
        <p className="text-xs mt-2">
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-fuchsia-400 hover:underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-sm" aria-label="Learn more about Gemini API billing">
            Gemini API Billing Information
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;