import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignUpPage = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate password
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }

    if (!/[0-9]/.test(formData.password)) {
      setError('Password must contain at least one number');
      return;
    }

    if (!/[!@#$%^&*]/.test(formData.password)) {
      setError('Password must contain at least one special character (!@#$%^&*)');
      return;
    }

    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await signUp(formData.email, formData.password, formData.name);
      setError('');
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg';
      successMessage.textContent = 'Account created successfully! Redirecting to sign in...';
      document.body.appendChild(successMessage);

      setTimeout(() => {
        document.body.removeChild(successMessage);
        navigate('/auth/signin');
      }, 1500);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('already exists')) {
          setError('An account with this email already exists');
        } else if (err.message.includes('valid email')) {
          setError('Please enter a valid email address');
        } else if (err.message.includes('at least 6 characters')) {
          setError('Password must be at least 6 characters long');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-24">
      <div className="max-w-md mx-auto px-4">
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 group">
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8">
          <h1 className="text-3xl font-light mb-8 text-center">Create Account</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 pl-12
                    focus:outline-none focus:border-yellow-500 transition-colors"
                  placeholder="Enter your full name"
                />
                <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Email</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 pl-12
                    focus:outline-none focus:border-yellow-500 transition-colors"
                  placeholder="Enter your email"
                />
                <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Password</label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 pl-12
                    focus:outline-none focus:border-yellow-500 transition-colors"
                  placeholder="Create a password"
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 pl-12
                    focus:outline-none focus:border-yellow-500 transition-colors"
                  placeholder="Confirm your password"
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full bg-yellow-500 text-black py-4 rounded-xl hover:bg-yellow-400 
                transition-colors transform hover:scale-[1.02] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            {error && (
              <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
            )}
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/auth/signin" className="text-yellow-500 hover:text-yellow-400">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage