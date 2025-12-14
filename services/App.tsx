import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import HeroSection from './components/HeroSection';
import Chatbot from './components/Chatbot';
import ExploreSection from './components/ExploreSection';
import PaymentForm from './components/PaymentForm';
import NotificationPanel from './components/NotificationPanel';
import Footer from './components/Footer';
import ItinerarySection from './components/ItinerarySection';
import { GuideBookingDetails, Itinerary } from './types';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<GuideBookingDetails | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);

  // Add initial notifications
  useEffect(() => {
    setNotifications([
      'Welcome to Local Discover! Start chatting with our AI assistant.',
      'Check out the "Explore" section for trending spots near you!',
      'Try generating a personalized itinerary with the AI Chatbot!',
    ]);
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
  }, []);

  const handleLogoutClick = useCallback(() => {
    setIsLoggedIn(false);
    onAddNotification('You have been logged out.');
  }, []);

  const onScrollToSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
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

  const onAddNotification = useCallback((message: string) => {
    setNotifications((prevNotifications) => [message, ...prevNotifications].slice(0, 5));
  }, []);

  const onAddItinerary = useCallback((newItinerary: Itinerary) => {
    setItineraries((prevItineraries) => [...prevItineraries, { ...newItinerary, id: `itinerary-${Date.now()}` }]);
    onAddNotification(`New itinerary "${newItinerary.name}" added!`);
  }, [onAddNotification]);

  // New function to allow ItinerarySection to trigger a prompt in the chatbot
  const handleTriggerChatPrompt = useCallback((prompt: string) => {
    // This will be passed to Chatbot to simulate a message
    // Chatbot needs a way to receive and process this "external" message
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        isLoggedIn={isLoggedIn}
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
        onLogoutClick={handleLogoutClick}
        onScrollToSection={onScrollToSection}
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
        <ExploreSection onAddNotification={onAddNotification} onBookGuide={handleBookGuide} />
        <ItinerarySection
          itineraries={itineraries}
          onAddNotification={onAddNotification}
          onScrollToChatbot={() => onScrollToSection('chatbot')}
          onBookGuide={handleBookGuide}
          onTriggerChatPrompt={handleTriggerChatPrompt} // Pass the new prop
        />
        <Chatbot
          onBookGuide={handleBookGuide}
          bookingSuccess={bookingSuccess}
          onAddNotification={onAddNotification}
          onAddItinerary={onAddItinerary}
          onTriggerChatPrompt={handleTriggerChatPrompt} // Pass the new prop
        />
        <NotificationPanel notifications={notifications} />
      </main>

      <Footer />
    </div>
  );
}

export default App;