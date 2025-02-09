import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, CreditCard, MapPin, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

// Function to generate readable order number
const generateOrderNumber = () => {
  const prefix = 'RED'; // RED for Ramadan & Eid Decor
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  const random = Math.random().toString(36).substring(2, 5).toUpperCase(); // 3 random alphanumeric
  return `${prefix}-${timestamp}-${random}`;
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { items, totalItems } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderNumber] = useState(generateOrderNumber());
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  // Pre-fill form with user data when available
  useEffect(() => {
    if (user) {
      const nameParts = user.name.split(' ');
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/signin');
      return;
    }

    if (items.length === 0) {
      navigate('/');
    }
  }, [isAuthenticated, navigate, items]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create order in database
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: user.id,
          total: totalPrice,
          status: 'pending',
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          }))
        });

      if (orderError) throw orderError;

      // Navigate to success page or user dashboard
      navigate('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfbf6] via-white to-[#fdfbf6] 
      dark:from-dark dark:via-dark-lighter dark:to-dark pt-24 pb-12">
      {/* Decorative elements */}
      <div className="absolute inset-0 islamic-pattern opacity-5 dark:opacity-10" />
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-dark-lighter rounded-2xl p-8 shadow-lg 
              dark:shadow-yellow-500/5 border border-neutral-100 dark:border-yellow-500/10">
              <h2 className="text-2xl font-light mb-6 dark:text-white flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-yellow-500" />
                Order Summary
              </h2>
              
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <img 
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium dark:text-white">{item.name}</h3>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-yellow-500">${item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-yellow-500/10">
                <div className="flex justify-between text-lg font-medium dark:text-white">
                  <span>Total ({totalItems} items)</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  Order #: <span className="font-mono text-yellow-600 dark:text-yellow-500">
                    {orderNumber}
                  </span>
                </div>

              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-white dark:bg-dark-lighter rounded-2xl p-8 shadow-lg 
            dark:shadow-yellow-500/5 border border-neutral-100 dark:border-yellow-500/10">
            <h2 className="text-2xl font-light mb-6 dark:text-white">Checkout Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium dark:text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-yellow-500" />
                  Shipping Information
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder={user?.name?.split(' ')[0] || "First Name"}
                      required
                      className="w-full bg-neutral-100 dark:bg-dark rounded-lg px-4 py-2
                        border border-neutral-200 dark:border-neutral-700 focus:outline-none 
                        focus:border-yellow-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder={user?.name?.split(' ').slice(1).join(' ') || "Last Name"}
                      required
                      className="w-full bg-neutral-100 dark:bg-dark rounded-lg px-4 py-2
                        border border-neutral-200 dark:border-neutral-700 focus:outline-none 
                        focus:border-yellow-500 transition-colors"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={user?.email || "Email"}
                    required
                    className="w-full bg-neutral-100 dark:bg-dark rounded-lg px-4 py-2
                      border border-neutral-200 dark:border-neutral-700 focus:outline-none 
                      focus:border-yellow-500 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Shipping Address"
                    required
                    className="w-full bg-neutral-100 dark:bg-dark rounded-lg px-4 py-2
                      border border-neutral-200 dark:border-neutral-700 focus:outline-none 
                      focus:border-yellow-500 transition-colors"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      required
                      className="w-full bg-neutral-100 dark:bg-dark rounded-lg px-4 py-2
                        border border-neutral-200 dark:border-neutral-700 focus:outline-none 
                        focus:border-yellow-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      required
                      className="w-full bg-neutral-100 dark:bg-dark rounded-lg px-4 py-2
                        border border-neutral-200 dark:border-neutral-700 focus:outline-none 
                        focus:border-yellow-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="ZIP Code"
                      required
                      className="w-full bg-neutral-100 dark:bg-dark rounded-lg px-4 py-2
                        border border-neutral-200 dark:border-neutral-700 focus:outline-none 
                        focus:border-yellow-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
              
              {/* Payment Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium dark:text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-yellow-500" />
                  Payment Information
                </h3>
                
                <div>
                  <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="Card Number"
                    required
                    className="w-full bg-neutral-100 dark:bg-dark rounded-lg px-4 py-2
                      border border-neutral-200 dark:border-neutral-700 focus:outline-none 
                      focus:border-yellow-500 transition-colors"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY (e.g., 12/25)"
                      required
                      className="w-full bg-neutral-100 dark:bg-dark rounded-lg px-4 py-2
                        border border-neutral-200 dark:border-neutral-700 focus:outline-none 
                        focus:border-yellow-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="CVV (e.g., 123)"
                      className="w-full bg-neutral-100 dark:bg-dark rounded-lg px-4 py-2
                        border border-neutral-200 dark:border-neutral-700 focus:outline-none 
                        focus:border-yellow-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
              
              {error && (
                <div className="p-4 bg-red-500/10 text-red-500 rounded-lg">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-500 text-black py-4 rounded-xl flex items-center 
                  justify-center gap-2 hover:bg-yellow-400 transition-colors transform 
                  hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Place Order'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage