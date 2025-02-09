import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!validateEmail(email)) {
      setMessage({
        type: 'error',
        text: 'Please enter a valid email address'
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Password reset instructions have been sent to your email'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to send reset instructions. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-24">
      <div className="max-w-md mx-auto px-4">
        <Link to="/auth/signin" className="inline-flex items-center text-gray-400 hover:text-white mb-8 group">
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Sign In
        </Link>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8">
          <h1 className="text-3xl font-light mb-2 text-center">Reset Password</h1>
          <p className="text-gray-400 text-center mb-8">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 pl-12
                    focus:outline-none focus:border-yellow-500 transition-colors"
                  placeholder="Enter your email"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  required
                />
                <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full bg-yellow-500 text-black py-4 rounded-xl hover:bg-yellow-400 
                transition-colors transform hover:scale-[1.02] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Sending Instructions...' : 'Send Reset Instructions'}
            </button>

            {message && (
              <div className={`p-4 rounded-lg text-center ${
                message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {message.text}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;