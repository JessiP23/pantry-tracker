// app/signin/page.js
'use client';
import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [error, setError] = ('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/'); // Redirect to homepage or another page
    } catch (error) {
        console.error('Error signing up:', error);
    }
  };

  const signUp = () => {
    router.push('/signup')
  }

  return (
    <div className='h-screen w-screen flex justify-center items-center bg-slate-500'>
      <div className='sm:shadow-xl px-8 pb-8 pt-12 sm:bg-white rounded-xl space-y-12'>
        <h1 className='font-semibold text-2xl text-indigo-900'>Sign In</h1>
        {error && (
          <div className='bg-red-500 text-white p-4 mb-4 rounded'>
            {error}
          </div>
        )}
        <form onSubmit={handleSignIn}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className='text-black w-full mb-10 border-b-2 border-gray-200 focus:border-indigo-500 focus:outline-none'
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className='text-black w-full mb-6 border-b-2 border-gray-200 focus:border-indigo-500 focus:outline-none'
            required
          />
          <button type="submit" className='text-indigo-500 hover:underline w-full mb-6'>Sign In</button>
          <button type='button' onClick={signUp} className='text-indigo-500 hover:underline w-full'>
            Don't have an account?
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
