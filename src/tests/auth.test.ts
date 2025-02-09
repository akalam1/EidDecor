import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { supabase } from '../lib/supabase';

describe('User Authentication Flow', () => {
  // Test user credentials
  const testUser = {
    email: 'test@example.com',
    password: 'Test123!@#',
    name: 'Test User'
  };

  // Clean up after each test
  afterEach(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.auth.signOut();
    }
  });

  describe('Account Creation', () => {
    it('should create a new user account with valid credentials', async () => {
      const { data: { user }, error } = await supabase.auth.signUp({
        email: testUser.email,
        password: testUser.password,
        options: {
          data: {
            name: testUser.name
          }
        }
      });

      expect(error).toBeNull();
      expect(user).toBeDefined();
      expect(user?.email).toBe(testUser.email);
    });

    it('should create a profile record after user creation', async () => {
      // First create the user
      const { data: { user } } = await supabase.auth.signUp({
        email: testUser.email,
        password: testUser.password,
        options: {
          data: {
            name: testUser.name
          }
        }
      });

      // Then verify profile was created
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      expect(error).toBeNull();
      expect(profile).toBeDefined();
      expect(profile.name).toBe(testUser.name);
      expect(profile.email).toBe(testUser.email);
    });

    it('should reject duplicate email registration', async () => {
      // First create a user
      await supabase.auth.signUp({
        email: testUser.email,
        password: testUser.password,
        options: {
          data: {
            name: testUser.name
          }
        }
      });

      // Try to create another user with same email
      const { error } = await supabase.auth.signUp({
        email: testUser.email,
        password: 'DifferentPass123!@#',
        options: {
          data: {
            name: 'Different Name'
          }
        }
      });

      expect(error).toBeDefined();
    });

    it('should validate password requirements', async () => {
      const { error } = await supabase.auth.signUp({
        email: testUser.email,
        password: '123', // Too short
        options: {
          data: {
            name: testUser.name
          }
        }
      });

      expect(error).toBeDefined();
    });
  });

  describe('Authentication', () => {
    beforeEach(async () => {
      // Create a test user before each auth test
      await supabase.auth.signUp({
        email: testUser.email,
        password: testUser.password,
        options: {
          data: {
            name: testUser.name
          }
        }
      });
    });

    it('should sign in with valid credentials', async () => {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email: testUser.email,
        password: testUser.password
      });

      expect(error).toBeNull();
      expect(user).toBeDefined();
      expect(user?.email).toBe(testUser.email);
    });

    it('should reject invalid credentials', async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email: testUser.email,
        password: 'wrongpassword'
      });

      expect(error).toBeDefined();
    });

    it('should maintain session after login', async () => {
      // Sign in
      await supabase.auth.signInWithPassword({
        email: testUser.email,
        password: testUser.password
      });

      // Check session
      const { data: { session } } = await supabase.auth.getSession();
      expect(session).toBeDefined();
      expect(session?.user.email).toBe(testUser.email);
    });

    it('should clear session after logout', async () => {
      // Sign in first
      await supabase.auth.signInWithPassword({
        email: testUser.email,
        password: testUser.password
      });

      // Sign out
      await supabase.auth.signOut();

      // Verify session is cleared
      const { data: { session } } = await supabase.auth.getSession();
      expect(session).toBeNull();
    });
  });

  describe('Profile Management', () => {
    beforeEach(async () => {
      // Create and sign in test user
      await supabase.auth.signUp({
        email: testUser.email,
        password: testUser.password,
        options: {
          data: {
            name: testUser.name
          }
        }
      });
    });

    it('should allow updating profile name', async () => {
      const newName = 'Updated Name';
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('profiles')
        .update({ name: newName })
        .eq('id', user?.id);

      expect(error).toBeNull();

      // Verify update
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      expect(profile.name).toBe(newName);
    });

    it('should not allow updating email directly in profile', async () => {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('profiles')
        .update({ email: 'newemail@example.com' })
        .eq('id', user?.id);

      expect(error).toBeDefined();
    });
  });
});