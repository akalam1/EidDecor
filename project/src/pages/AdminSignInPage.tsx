import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const AdminSignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // First sign in the user
      await signIn(email, password);
      
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        throw new Error('Authentication failed');
      }

      // Verify admin status
      const { data: adminAuth, error: adminError } = await supabase
        .from('admin_auth')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (adminError || !adminAuth) {
        throw new Error('Unauthorized access');
      }

      // Update last login
      await supabase
        .from('admin_auth')
        .update({ last_login: new Date().toISOString() })
        .eq('id', adminAuth.id);

      navigate('/admin');
    } catch (err) {
      console.error('Admin login error:', err);
      setError(err instanceof Error ? err.message : 'Invalid admin credentials');
      // Sign out if admin check fails
      await supabase.auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-md mx-auto px-4 pt-24">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8">
          <h1 className="text-3xl font-light mb-8 text-center">Admin Access</h1>
          
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
                  placeholder="Enter admin email"
                />
                <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 pl-12
                    focus:outline-none focus:border-yellow-500 transition-colors"
                  placeholder="Enter admin password"
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-600 text-yellow-500 focus:ring-yellow-500" />
                <span className="ml-2 text-gray-400">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => navigate('/admin/forgot-password')}
                className="text-yellow-500 hover:text-yellow-400"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className={`w-full bg-yellow-500 text-black py-4 rounded-xl hover:bg-yellow-400 
                transition-colors transform hover:scale-[1.02] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In as Admin'}
            </button>
            {error && (
              <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
            )}
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Need an admin account?{' '}
              <button 
                onClick={() => navigate('/admin/signup')}
                className="text-yellow-500 hover:text-yellow-400"
              >
                Request access
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignInPage;