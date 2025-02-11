'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabaseAdmin } from '@/lib/supabase/config';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Update both fullName and email when user data changes
  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabaseAdmin
        .from('users')
        .update({ full_name: fullName })
        .eq('id', user?.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
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
    <div className="container mx-auto p-4">
      <div className="mx-auto max-w-md space-y-6">
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

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                />
              ) : (
                <div className="mt-1 flex items-center justify-between">
                  <span className="block rounded-md bg-gray-50 px-3 py-2">
                    {user?.full_name || 'Not set'}
                  </span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            {isEditing && (
              <button
                onClick={handleUpdateProfile}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>

        {/* Help & Support Card */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Help & Support</h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Need help? Contact our support team or check our documentation.
            </p>
            <div className="flex gap-3">
              <a
                href="mailto:support@tennis-coaching.com"
                className="inline-flex items-center rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
              >
                Contact Support
              </a>
              <a
                href="/docs"
                className="inline-flex items-center rounded-md bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Documentation
              </a>
            </div>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
} 