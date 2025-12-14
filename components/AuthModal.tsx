import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (type: 'login' | 'signup') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // For prototype, simply simulate success
    if (isLogin) {
      if (email && password) {
        console.log('Logging in:', { email, password });
        onAuthSuccess('login');
        onClose();
      } else {
        setError('Please enter both email and password.');
      }
    } else {
      if (username && email && password) {
        console.log('Signing up:', { username, email, password });
        onAuthSuccess('signup');
        onClose();
      } else {
        setError('Please fill in all fields.');
      }
    }
    // Reset form fields
    setEmail('');
    setPassword('');
    setUsername('');
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-[100] p-4 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md relative transform scale-95 transition-transform duration-300 ease-out-quad" role="document">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-100 text-3xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 rounded-full p-1"
          aria-label="Close authentication form"
        >
          &times;
        </button>
        <h2 id="auth-modal-title" className="text-4xl font-extrabold text-white mb-8 text-center">
          {isLogin ? 'Welcome Back!' : 'Join Us!'}
        </h2>
        {error && <p className="text-red-400 text-sm mb-4 text-center bg-red-900/30 p-2 rounded-md">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="relative">
              <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="shadow-sm appearance-none border border-gray-700 bg-gray-900 rounded-lg w-full py-3 px-4 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition duration-200"
                placeholder="Choose your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={!isLogin}
                aria-required={!isLogin}
              />
            </div>
          )}
          <div className="relative">
            <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="shadow-sm appearance-none border border-gray-700 bg-gray-900 rounded-lg w-full py-3 px-4 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition duration-200"
              placeholder="your@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
            />
          </div>
          <div className="relative">
            <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow-sm appearance-none border border-gray-700 bg-gray-900 rounded-lg w-full py-3 px-4 text-gray-100 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition duration-200"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-required="true"
            />
          </div>
          <div>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-fuchsia-600 hover:from-blue-700 hover:to-fuchsia-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 transition duration-300 ease-in-out w-full transform hover:scale-101"
            >
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </div>
        </form>
        <p className="text-center text-gray-400 text-sm mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(''); // Clear error when switching
            }}
            className="text-fuchsia-500 hover:text-fuchsia-400 font-bold transition-colors duration-200 focus:outline-none focus:underline"
            aria-label={isLogin ? 'Switch to sign up' : 'Switch to login'}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;