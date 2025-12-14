import React, { useState } from 'react';
import { GuideBookingDetails } from '../types';

interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: GuideBookingDetails | null;
  onPaymentSuccess: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ isOpen, onClose, bookingDetails, onPaymentSuccess }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!isOpen || !bookingDetails) return null;

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentError(null);
    setPaymentSuccess(false);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // For prototype, always succeed
      setPaymentSuccess(true);
      onPaymentSuccess();
      // Optionally, close the modal after a short delay
      setTimeout(() => {
        onClose();
        setCardNumber('');
        setExpiryDate('');
        setCvv('');
        setCardHolder('');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-[100] p-4 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="payment-modal-title">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-lg relative transform scale-95 transition-transform duration-300 ease-out-quad" role="document">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-100 text-3xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 rounded-full p-1"
          aria-label="Close payment form"
        >
          &times;
        </button>
        <h2 id="payment-modal-title" className="text-3xl font-bold text-white mb-6 text-center">
          Complete Your Booking Payment
        </h2>

        <div className="mb-6 bg-blue-900/50 p-4 rounded-lg border border-blue-700 shadow-sm">
          <p className="text-lg font-semibold text-blue-100 mb-2">Booking Summary:</p>
          <ul className="text-gray-200 space-y-1" aria-label="Booking details">
            <li><span className="font-medium">Guide:</span> {bookingDetails.guideName}</li>
            <li><span className="font-medium">Activity:</span> {bookingDetails.activity}</li>
            <li><span className="font-medium">Date:</span> {bookingDetails.date}</li>
            <li><span className="font-medium">Time:</span> {bookingDetails.time}</li>
            <li className="text-xl font-bold text-fuchsia-400 pt-2" aria-label="Total price">Total: ${bookingDetails.price.toFixed(2)}</li>
          </ul>
        </div>

        {paymentError && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative mb-4 animate-fade-in" role="alert">
            {paymentError}
          </div>
        )}
        {paymentSuccess && (
          <div className="bg-emerald-900/50 border border-emerald-700 text-emerald-300 px-4 py-3 rounded-lg relative mb-4 animate-fade-in" role="status">
            Payment successful! Redirecting...
          </div>
        )}

        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="cardHolder">
              Card Holder Name
            </label>
            <input
              type="text"
              id="cardHolder"
              className="shadow-sm appearance-none border border-gray-700 bg-gray-900 rounded-lg w-full py-3 px-4 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition duration-200"
              placeholder="Full Name on Card"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              required
              disabled={isProcessing || paymentSuccess}
              aria-required="true"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="cardNumber">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              className="shadow-sm appearance-none border border-gray-700 bg-gray-900 rounded-lg w-full py-3 px-4 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition duration-200"
              placeholder="•••• •••• •••• ••••"
              maxLength={19} // 16 digits + 3 spaces
              value={cardNumber.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim()}
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))} // Only allow digits
              required
              disabled={isProcessing || paymentSuccess}
              aria-required="true"
              inputMode="numeric"
              pattern="[0-9]{13,19}"
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="expiryDate">
                Expiry Date
              </label>
              <input
                type="text"
                id="expiryDate"
                className="shadow-sm appearance-none border border-gray-700 bg-gray-900 rounded-lg w-full py-3 px-4 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition duration-200"
                placeholder="MM/YY"
                maxLength={5}
                value={expiryDate}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.length > 2) value = value.substring(0, 2) + '/' + value.substring(2, 4);
                  setExpiryDate(value);
                }}
                required
                disabled={isProcessing || paymentSuccess}
                aria-required="true"
                inputMode="numeric"
                pattern="(0[1-9]|1[0-2])\/([0-9]{2})"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="cvv">
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                className="shadow-sm appearance-none border border-gray-700 bg-gray-900 rounded-lg w-full py-3 px-4 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition duration-200"
                placeholder="•••"
                maxLength={4}
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))} // Only allow digits
                required
                disabled={isProcessing || paymentSuccess}
                aria-required="true"
                inputMode="numeric"
                pattern="[0-9]{3,4}"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-300 w-full disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-101"
            disabled={isProcessing || paymentSuccess}
            aria-label={isProcessing ? 'Processing payment' : 'Pay now'}
          >
            {isProcessing ? 'Processing Payment...' : 'Pay Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;