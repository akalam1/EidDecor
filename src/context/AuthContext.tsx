import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface AuthUser {
  id: string;
  email: string;
  user_metadata: {
    name: string;
  };
}

interface Profile {
  name: string;
  email: string;
  id: string;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session check error:', error);
          setUser(null);
          return;
        }
        
        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Initial profile fetch error:', profileError);
            setUser(null);
            return;
          }

          if (profile) {
            setUser(profile);
          } else {
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Session check error:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        // Handle auth events
        switch (event) {
          case 'SIGNED_OUT':
          case 'USER_DELETED':
            setUser(null);
            return;
            
          case 'TOKEN_REFRESHED':
          case 'SIGNED_IN':
          case 'INITIAL_SESSION':
            if (!session?.user) return;
            
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profileError) {
              console.error('Profile fetch error:', profileError);
              return;
            }

            if (profile) {
              setUser(profile);
            }
            break;
            
          default:
            break;
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
    
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          throw new Error('Failed to fetch user profile');
        }

        if (!profile) {
          const { error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email || '',
              name: user.user_metadata.name || user.user_metadata.full_name || email.split('@')[0],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (createError) {
            console.error('Profile creation error:', createError);
            throw new Error('Failed to create user profile');
          }

          const { data: newProfile, error: newProfileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (newProfileError || !newProfile) {
            throw new Error('Failed to fetch new user profile');
          }

          setUser(newProfile);
        } else {
          setUser(profile);
        }
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            full_name: name // Add full_name to metadata for compatibility
          },
          emailRedirectTo: `${window.location.origin}/auth/signin`
        }
      });

      if (error) {
        throw error;
      }

      if (user) {
        // Wait for the database trigger to complete
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Verify profile was created
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError || !profile) {
          // Manual profile creation as fallback
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: email,
              name: name,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (insertError) {
            console.error('Failed to create profile:', insertError);
            throw new Error('Failed to complete signup process');
          }
        }

        // Return early with success
        return;
      }

      throw new Error('No user returned from signup');
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      
      // Clear user state
      setUser(null);
    } catch (err) {
      console.error('Sign out error:', err);
      // Still clear user state on error
      setUser(null);
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user?.id) return;

    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id);

    if (error) {
      throw error;
    }

    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}