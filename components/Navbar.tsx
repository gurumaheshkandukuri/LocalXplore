import React, { useState } from 'react';

interface NavbarProps {
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onLogoutClick: () => void;
  onScrollToSection: (id: string) => void;
  onToggleNotifications: () => void;
  notificationsCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onLoginClick, onSignupClick, onLogoutClick, onScrollToSection, onToggleNotifications, notificationsCount }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavLinkClick = (id: string) => {
    onScrollToSection(id);
    setIsOpen(false);
  };

  return (
    <nav className="fixed w-full top-0 z-50 p-4 bg-gradient-to-r from-blue-700/30 to-fuchsia-700/30 backdrop-blur-md shadow-lg transition-all duration-300" aria-label="Main Navigation">
      <div className="container mx-auto flex justify-between items-center flex-wrap">
        <div className="text-white text-2xl font-bold tracking-wide">
          <a href="#" className="hover:text-gray-200 transition duration-300" onClick={() => handleNavLinkClick('root')}>LocalXplore</a>
        </div>
        
        {/* Mobile specific controls: hamburger + notification bell */}
        <div className="flex items-center gap-x-2 lg:hidden">
          {/* Hamburger menu button */}
          <button
            onClick={toggleMenu}
            className="flex items-center px-3 py-2 border rounded text-blue-200 border-blue-400 hover:text-white hover:border-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title>{isOpen ? <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"/> : <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>}</svg>
          </button>

          {/* Notification Bell for small screens, right of menu icon */}
          <button
            onClick={onToggleNotifications}
            className="relative text-white hover:text-gray-200 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            aria-label="Toggle notifications"
          >
            <i className="fas fa-bell text-xl"></i>
            {notificationsCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                {notificationsCount}
              </span>
            )}
          </button>
        </div>

        <div
          className={`w-full lg:flex lg:items-center lg:w-auto ${isOpen ? 'block' : 'hidden'}`}
          id="mobile-menu"
        >
          <div className="text-sm lg:flex-grow flex flex-col lg:flex-row mt-4 lg:mt-0">
            <a
              href="#about"
              className="block mt-2 lg:inline-block lg:mt-0 text-white hover:text-gray-200 px-3 py-2 rounded transition duration-300"
              onClick={(e) => { e.preventDefault(); handleNavLinkClick('about'); }}
            >
              About
            </a>
            <a
              href="#features"
              className="block mt-2 lg:inline-block lg:mt-0 text-white hover:text-gray-200 px-3 py-2 rounded transition duration-300"
              onClick={(e) => { e.preventDefault(); handleNavLinkClick('features'); }}
            >
              Features
            </a>
            <a
              href="#explore"
              className="block mt-2 lg:inline-block lg:mt-0 text-white hover:text-gray-200 px-3 py-2 rounded transition duration-300"
              onClick={(e) => { e.preventDefault(); handleNavLinkClick('explore'); }}
            >
              Explore
            </a>
            <a
              href="#itineraries"
              className="block mt-2 lg:inline-block lg:mt-0 text-white hover:text-gray-200 px-3 py-2 rounded transition duration-300"
              onClick={(e) => { e.preventDefault(); handleNavLinkClick('itineraries'); }}
            >
              Itineraries
            </a>
            <a
              href="#testimonials"
              className="block mt-2 lg:inline-block lg:mt-0 text-white hover:text-gray-200 px-3 py-2 rounded transition duration-300"
              onClick={(e) => { e.preventDefault(); handleNavLinkClick('testimonials'); }}
            >
              Testimonials
            </a>
            {/* Removed the old text-based notifications link */}
          </div>
          <div className="mt-4 lg:mt-0 flex flex-col lg:flex-row items-stretch lg:items-center">
            {/* Desktop Notification Bell */}
            <button
              onClick={onToggleNotifications}
              className="relative text-white hover:text-gray-200 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white mr-2 hidden lg:inline-block"
              aria-label="Toggle notifications"
            >
              <i className="fas fa-bell text-xl"></i>
              {notificationsCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                  {notificationsCount}
                </span>
              )}
            </button>
            {isLoggedIn ? (
              <button
                onClick={onLogoutClick}
                className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-fuchsia-700 hover:bg-white transition duration-300 w-full lg:w-auto"
                aria-label="Logout"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-fuchsia-700 hover:bg-white transition duration-300 mr-0 lg:mr-2 mb-2 lg:mb-0 w-full lg:w-auto"
                  aria-label="Login"
                >
                  Login
                </button>
                <button
                  onClick={onSignupClick}
                  className="inline-block text-sm px-4 py-2 leading-none rounded bg-white text-fuchsia-700 border-transparent hover:bg-fuchsia-100 transition duration-300 w-full lg:w-auto"
                  aria-label="Sign Up"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;