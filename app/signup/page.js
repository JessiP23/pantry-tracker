'use client';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useRouter } from 'next/navigation';
import './style.css'

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); 
    const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
        
      router.push('/signin'); // Redirect to homepage or another page
    } catch (error) {
      console.error('Error signing up:', error);
      setError(error.message);
    }
  };

  const signIn = () => {
    router.push('/signin');
  };

  return (
    <div className='h-screen w-screen flex justify-center items-center bg-slate-500'>
      <div className='sm:shadow-xl px-8 pb-8 pt-12 sm:bg-white rounded-xl space-y-12'>
        <h1 className='font-semibold text-2xl text-indigo-900'>Sign Up</h1>
        {error && (
          <div className='bg-red-500 text-white p-4 mb-4 rounded'>
            {error}
          </div>
        )}
        <form onSubmit={handleSignUp}>
          <input
            type="email"
            value={email}
            className='text-black w-full mb-10 border-b-2 border-gray-200 focus:border-indigo-500 focus:outline-none'
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            className='text-black w-full mb-6 border-b-2 border-gray-200 focus:border-indigo-500 focus:outline-none'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit" className='text-indigo-500 hover:underline w-full mb-6'>Sign Up</button>
          <button type='button' onClick={signIn} className='text-indigo-500 hover:underline w-full'>
            Already have an account?
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
