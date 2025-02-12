'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabaseAdmin } from '@/lib/supabase/config';
import { useRouter } from 'next/navigation';
import { UserCircle } from 'lucide-react';
import { User } from '@/types/auth';

export default function ProfilePage() {
  const { user, signOut, refreshUserData } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Update both fullName and email when user data changes
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      setMessage(null);

      const { error } = await supabaseAdmin
        .from('users')
        .update({ full_name: fullName })
        .eq('id', user?.id);

      if (error) throw error;

      // Refresh user data in context
      await refreshUserData();

      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      setMessage({ type: 'error', text: 'Failed to sign out' });
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      {message && (
        <div className={`rounded-md p-4 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700' 
            : 'bg-red-50 text-red-700'
        }`}>
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      {/* Profile Info */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        {/* Avatar Section */}
        <div className="mb-6 flex justify-center">
          <UserCircle className="h-24 w-24 text-gray-400" />
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Email</h2>
            <p className="mt-1">{email}</p>
          </div>
          
          <div>
            <h2 className="text-sm font-medium text-gray-500">Full Name</h2>
            {isEditing ? (
              <div className="mt-1 space-y-2">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  placeholder="Enter your full name"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateProfile}
                    disabled={isLoading}
                    className="rounded-md bg-brand-primary px-3 py-2 text-sm text-white hover:bg-brand-primary-dark disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="mt-1">{fullName || 'Not set'}</p>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-brand-primary hover:text-brand-primary-dark"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Help & Support */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Help & Support</h2>
        <p className="mt-2 text-gray-600">
          Having trouble? Our support team is here to help you.
        </p>
        <div className="mt-4 space-x-4">
          <button className="text-brand-primary hover:text-brand-primary-dark">
            Contact Support
          </button>
        </div>
      </div>

      {/* Sign Out Button */}
      <button 
        onClick={handleSignOut}
        className="w-full rounded-lg bg-brand-primary px-4 py-3 text-white hover:bg-brand-primary-dark"
      >
        Sign Out
      </button>
    </div>
  );
} 