import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import FeaturesSection from './components/FeaturesSection';
import ExploreSection from './components/ExploreSection';
import PaymentForm from './components/PaymentForm';
import NotificationPanel from './components/NotificationPanel';
import TestimonialsSection from './components/TestimonialsSection';
import Footer from './components/Footer';
import ItinerarySection from './components/ItinerarySection';
import Chatbot from './components/Chatbot'; // Corrected import path
import { GuideBookingDetails, Itinerary } from './types';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<GuideBookingDetails | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [chatInputTrigger, setChatInputTrigger] = useState<string | null>(null);
  const [showFloatingChatbot, setShowFloatingChatbot] = useState(false);
  const [showFloatingNotifications, setShowFloatingNotifications] = useState(false); // State for floating notifications

  // Add initial notifications
  useEffect(() => {
    setNotifications([
      'Welcome to LocalXplore! Start chatting with our AI assistant.',
      'Check out the "Explore" section for trending spots near you!',
      'Try generating a personalized itinerary with the AI Chatbot!',
    ]);
  }, []);

  const onAddNotification = useCallback((message: string) => {
    setNotifications((prevNotifications) => [message, ...prevNotifications].slice(0, 5));
  }, []);

  const handleLoginClick = useCallback(() => {
    setShowAuthModal(true);
  }, []);

  const handleSignupClick = useCallback(() => {
    setShowAuthModal(true);
  }, []);

  const handleAuthSuccess = useCallback((type: 'login' | 'signup') => {
    setIsLoggedIn(true);
    setShowAuthModal(false);
    onAddNotification(`You have successfully ${type === 'login' ? 'logged in' : 'signed up'}!`);
  }, [onAddNotification]);

  const handleLogoutClick = useCallback(() => {
    setIsLoggedIn(false);
    onAddNotification('You have been logged out.');
  }, [onAddNotification]);

  const onScrollToSection = useCallback((id: string) => {
    if (id === 'chatbot') {
      setShowFloatingChatbot(true);
    } else if (id === 'notifications') { // Handle notifications separately for floating panel
      setShowFloatingNotifications(true);
    }
    else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleDiscoverClick = useCallback(() => {
    onScrollToSection('explore');
  }, [onScrollToSection]);

  const handleBookGuide = useCallback((details: GuideBookingDetails) => {
    setBookingDetails(details);
    setShowPaymentModal(true);
    setBookingSuccess(false);
  }, []);

  const handlePaymentSuccess = useCallback(() => {
    console.log('Payment successful in App.tsx');
    setBookingSuccess(true);
    setShowPaymentModal(false);
  }, []);

  const onAddItinerary = useCallback((newItinerary: Itinerary) => {
    setItineraries((prevItineraries) => [...prevItineraries, { ...newItinerary, id: `itinerary-${Date.now()}` }]);
    onAddNotification(`New itinerary "${newItinerary.name}" added!`);
  }, [onAddNotification]);

  // This function is for external components to trigger a specific prompt in the chatbot
  const handleTriggerChatPrompt = useCallback((prompt: string) => {
    setChatInputTrigger(prompt);
    setShowFloatingChatbot(true); // Always open chatbot when triggering a prompt
    onAddNotification('AI is generating a new itinerary for you. Check the Chatbot!');
  }, [onAddNotification]);

  // Fix: New function specifically for ItinerarySection's "Generate New Itinerary with AI" button
  const handleOpenItineraryForm = useCallback(() => {
    setChatInputTrigger('Help me create a personalized travel itinerary.'); // Set a default prompt
    setShowFloatingChatbot(true);
    onAddNotification('Opening AI Chatbot to help you create an itinerary!');
  }, [onAddNotification]);

  const handleChatTriggerConsumed = useCallback(() => {
    setChatInputTrigger(null);
  }, []);

  const handleToggleNotifications = useCallback(() => {
    setShowFloatingNotifications(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <Navbar
        isLoggedIn={isLoggedIn}
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
        onLogoutClick={handleLogoutClick}
        onScrollToSection={onScrollToSection}
        onToggleNotifications={handleToggleNotifications}
        notificationsCount={notifications.length}
      />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
      <PaymentForm
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        bookingDetails={bookingDetails}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <main className="flex-grow">
        <HeroSection onDiscoverClick={handleDiscoverClick} />
        <AboutSection />
        <FeaturesSection />
        <ExploreSection onAddNotification={onAddNotification} onBookGuide={handleBookGuide} />
        <ItinerarySection
          itineraries={itineraries}
          onAddNotification={onAddNotification}
          onBookGuide={handleBookGuide}
          // Fix: Replaced non-existent props with the correct one as per ItinerarySectionProps
          onOpenItineraryForm={handleOpenItineraryForm} 
        />
        <TestimonialsSection />
      </main>

      {/* Floating Chatbot Icon */}
      <button
        onClick={() => setShowFloatingChatbot(!showFloatingChatbot)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-fuchsia-500 hover:from-blue-600 hover:to-fuchsia-600 text-white text-2xl p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-fuchsia-300 animate-pulse z-[90]"
        aria-label={showFloatingChatbot ? "Close AI Chat Assistant" : "Open AI Chat Assistant"}
      >
        <i className="fas fa-robot"></i>
      </button>

      {/* Floating Chatbot Component */}
      <Chatbot
        isOpen={showFloatingChatbot}
        onCloseChatbot={() => setShowFloatingChatbot(false)}
        onBookGuide={handleBookGuide}
        bookingSuccess={bookingSuccess}
        onAddNotification={onAddNotification}
        onAddItinerary={onAddItinerary}
        chatTriggerPrompt={chatInputTrigger}
        onChatTriggerConsumed={handleChatTriggerConsumed}
      />

      {/* Floating Notification Panel */}
      <NotificationPanel
        notifications={notifications}
        isOpen={showFloatingNotifications}
        onClose={() => setShowFloatingNotifications(false)}
      />

      <Footer />
    </div>
  );
}

export default App;