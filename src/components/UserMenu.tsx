import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Edit, X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserMenu = ({ isOpen, onClose }: UserMenuProps) => {
  const { user, signOut, isAuthenticated, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      setEditedName(user.name);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  if (!isAuthenticated) {
    return (
      <div
        ref={menuRef}
        className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg py-2 z-50"
      >
        <div className="px-6 py-4">
          <h3 className="text-lg font-medium mb-2">Welcome</h3>
          <p className="text-gray-600 mb-4">Sign in to manage your account</p>
          <button
            onClick={() => {
              onClose();
              navigate('/auth/signin');
            }}
            className="w-full bg-yellow-500 text-white py-3 rounded-xl mb-2 hover:bg-yellow-400 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => {
              onClose();
              navigate('/auth/signup');
            }}
            className="w-full border-2 border-yellow-500 text-yellow-500 py-3 rounded-xl
              hover:bg-yellow-500 hover:text-white transition-all"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={menuRef}
      className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg py-2 z-50"
    >
      <div className="p-4 space-y-4">
        <button
          onClick={() => {
            navigate('/account');
            onClose();
          }}
          className="w-full px-4 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-400 
            transition-colors flex items-center justify-center gap-2"
        >
          <User className="w-5 h-5" />
          View Account
        </button>
        
        <button
          onClick={() => {
            signOut();
            onClose();
          }}
          className="w-full px-4 py-3 border-2 border-yellow-500 text-yellow-500 rounded-xl
            hover:bg-yellow-500 hover:text-white transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserMenu