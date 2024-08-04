// hooks/useAuth.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase'; // Ensure this is correctly set up
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Modular SDK import

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/signin');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const signOutUser = async () => {
    try {
      console.log('Attempting to sign out user..')
      await signOut(auth);
      console.log('user signed out successfully')
      setUser(null);
      router.push('/signin');
    } catch (error) {
      console.error('error signing out user:', error);
    }
  }

  return { user, loading, signOutUser };
};

export default useAuth;
