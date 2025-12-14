import React from 'react';

interface NotificationPanelProps {
  notifications: string[];
  isOpen: boolean; // New prop to control visibility
  onClose: () => void; // New prop to close the panel
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, isOpen, onClose }) => {

  if (!isOpen) return null; // Don't render if not open

  return (
    <div
      className="fixed top-20 right-4 z-50 w-full max-w-sm h-auto max-h-[80vh] bg-gradient-to-br from-gray-900/90 to-blue-900/90 rounded-xl shadow-2xl overflow-hidden flex flex-col border border-fuchsia-400 backdrop-blur-md
                 transition-transform duration-300 ease-in-out transform translate-x-0 opacity-100
                 max-[600px]:inset-4 max-[600px]:w-auto max-[600px]:max-h-[calc(100vh-8rem)] max-[600px]:max-w-[calc(100vw-2rem)]" // Responsive adjustments
      role="dialog"
      aria-modal="true"
      aria-labelledby="notifications-title"
    >
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white shadow-md">
        <h2 id="notifications-title" className="text-xl font-bold flex items-center">
          <i className="fas fa-bell text-yellow-300 mr-3 text-2xl"></i> Your Notifications
        </h2>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 text-2xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white rounded-full p-1"
          aria-label="Close notifications panel"
        >
          &times;
        </button>
      </div>

      <div
        id="notifications-list"
        className="flex-grow p-4 overflow-y-auto custom-scrollbar bg-gray-800"
        role="region"
        aria-live="polite"
      >
        {notifications.length === 0 ? (
          <p className="text-gray-400 text-center py-4 text-lg italic">No new notifications.</p>
        ) : (
          <ul className="space-y-3">
            {notifications.map((note, index) => (
              <li key={index} className="flex items-start bg-white/5 p-4 rounded-lg shadow-sm border border-gray-700 transition-transform duration-200 hover:scale-[1.01]" role="listitem">
                <div className="flex-shrink-0 mr-3 mt-1">
                  <i className="fas fa-info-circle text-blue-400 text-xl" aria-hidden="true"></i>
                </div>
                <p className="text-gray-200 text-base">{note}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;