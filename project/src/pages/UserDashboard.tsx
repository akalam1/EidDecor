import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  User, 
  ShoppingBag,
  Clock,
  Check,
  X,
} from 'lucide-react';

const UserDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-yellow-500">Loading...</div>
      </div>
    );
  }

  // Mock data - In production, this would come from your backend
  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A';
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchOrders();
    }
  }, [user?.id]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) throw error;

      setSuccess('Password updated successfully');
      setPasswordForm({
        newPassword: '',
        confirmPassword: ''
      });
      setIsChangingPassword(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
    }
  };

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newName.trim()) {
      setError('Name cannot be empty');
      return;
    }

    try {
      // First update the profile
      const { error } = await supabase
        .from('profiles')
        .update({ 
          name: newName.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) throw error;

      // Then update the user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { name: newName.trim() }
      });

      if (metadataError) throw metadataError;

      setSuccess('Name updated successfully');
      setIsEditingName(false);
      
      // Wait a bit before refreshing to show success message
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update name');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfbf6] via-white to-[#fdfbf6] 
      dark:from-dark dark:via-dark-lighter dark:to-dark pt-24 pb-12">
      {/* Decorative elements */}
      <div className="absolute inset-0 islamic-pattern opacity-5 dark:opacity-10" />
      
      <div className="max-w-7xl mx-auto px-4">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <User className="w-10 h-10 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-light mb-2 dark:text-white flex items-center justify-center gap-2">
            Welcome back, {user?.name}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Member since {memberSince}
          </p>
        </div>

        {/* Account Settings */}
        <div className="bg-white dark:bg-dark-lighter rounded-2xl p-8 mb-8 shadow-lg 
          dark:shadow-yellow-500/5 border border-neutral-100 dark:border-yellow-500/10">
          <h2 className="text-2xl font-light mb-6 dark:text-white">Account Settings</h2>
          
          {/* Name Change */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium dark:text-white">Name</h3>
              <form 
                onSubmit={handleNameUpdate}
                className={`flex items-center gap-2 ${isEditingName ? 'w-full max-w-md' : ''}`}
              >
                {!isEditingName ? (
                  <button
                    type="button"
                    onClick={() => setIsEditingName(true)}
                    className="text-yellow-500 hover:text-yellow-400 transition-colors"
                  >
                    Change Name
                  </button>
                ) : (
                  <>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="flex-1 bg-neutral-100 dark:bg-dark px-4 py-2 rounded-lg 
                        border border-neutral-200 dark:border-neutral-700 focus:outline-none 
                        focus:border-yellow-500 transition-colors"
                      placeholder="Enter new name"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingName(false);
                        setNewName(user?.name || '');
                      }}
                      className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>

          {/* Password Change */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium dark:text-white">Password</h3>
              <button
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="text-yellow-500 hover:text-yellow-400 transition-colors"
              >
                Change Password
              </button>
            </div>

            {isChangingPassword && (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="w-full bg-neutral-100 dark:bg-dark rounded-lg px-4 py-2
                      border border-neutral-200 dark:border-neutral-700 focus:outline-none 
                      focus:border-yellow-500 transition-colors"
                    required
                    minLength={6}
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="w-full bg-neutral-100 dark:bg-dark rounded-lg px-4 py-2
                      border border-neutral-200 dark:border-neutral-700 focus:outline-none 
                      focus:border-yellow-500 transition-colors"
                    required
                    minLength={6}
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordForm({
                        newPassword: '',
                        confirmPassword: ''
                      });
                    }}
                    className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 
                      dark:hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-400 
                      transition-colors transform hover:scale-105"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 text-red-500 rounded-lg flex items-center gap-2">
              <X className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="mt-4 p-4 bg-green-500/10 text-green-500 rounded-lg flex items-center gap-2">
              <Check className="w-5 h-5 flex-shrink-0" />
              <p>{success}</p>
            </div>
          )}

          {/* Sign Out Button */}
          <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-yellow-500/10">
            <button
              onClick={handleSignOut}
              className="w-full bg-red-500/10 text-red-500 py-3 rounded-lg hover:bg-red-500/20 
                transition-colors transform hover:scale-105"
            >
              Sign Out
            </button>
          </div>
        </div>


        {/* Recent Orders */}
        <div className="bg-white dark:bg-dark-lighter rounded-2xl p-8 shadow-lg 
          dark:shadow-yellow-500/5 border border-neutral-100 dark:border-yellow-500/10">
          <h2 className="text-2xl font-light mb-6 dark:text-white">Recent Orders</h2>
          
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div 
                key={order.id}
                className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 
                  dark:bg-dark hover:bg-neutral-100 dark:hover:bg-dark-light transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="font-medium dark:text-white">{order.id}</p>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Clock className="w-4 h-4" />
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium dark:text-white">${order.total.toFixed(2)}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <div className="ml-4">
                  <span className={`px-3 py-1 rounded-full text-sm
                    ${order.status === 'delivered' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' 
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400'
                    }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {!isLoading && orders.length === 0 && (
              <p className="text-center text-neutral-600 dark:text-neutral-400">
                No orders found
              </p>
            )}
            {isLoading && (
              <div className="text-center text-neutral-600 dark:text-neutral-400">
                Loading orders...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;