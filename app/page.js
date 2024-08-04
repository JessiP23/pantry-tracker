'use client'
import React, {useState, useEffect} from "react";
import { addDoc, collection, getDocs, onSnapshot, querySnapshot, query, deleteDoc, doc } from "firebase/firestore"; 
import { db } from "./firebase";
import pantry from './images/pantry.jpg'
import tracker from './images/tracker.jpg'
import fruit from './images/fruit.jpg'
import Image from "next/image";
import Link from "next/link";
import Sidebar from './sidebar'
import './page.css'
import useAuth from "./hooks/useAuth";


export default function Home() {

  const {user, signOutUser} = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSideBar = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    console.log('Calling signoutuser function...');
    await signOutUser();
    console.log('SignOutUser function called!')
  }

  


  return (
    <main>
      {user? (
      <div className={`lg:w-1/5 xl:w-1/5 lg:block xl:block md:hidden sm:hidden min-h-screen bg-slate-800 text-white p-4 fixed text-center top-0 sidebar-i ${isOpen ? 'open': ''}`}>
        <h2 className="text-4xl mt-[10%] font-semibold ">Pantry.ai</h2>
        <ul>
          <li className="mt-[30%] text-xl py-2 cursor-pointer font-semibold" >
            <Link href="/">Home</Link>
          </li>
          <li className="mt-[15%] text-xl py-2 cursor-pointer font-semibold">
            <Link href="/dashboard/inventory">Inventory</Link>
          </li>
          <li className="mt-[15%] text-xl py-2 cursor-pointer font-semibold"><Link href='/dashboard/recipe'>Recipe</Link></li>

          <h1 className="mt-[65%] text-lg py-2 cursor-pointer font-semibold">{user.email}</h1>
         
          <li className="mt-[15%] text-xl py-2 cursor-pointer font-semibold "><Link href='/signin'>
            <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" className="fixed left-40 bottom-10" xmlns="http://www.w3.org/2000/svg" onClick={handleSignOut}>
              <path  fillRule="evenodd" clipRule="evenodd" d="M16.125 12C16.125 11.5858 15.7892 11.25 15.375 11.25L4.40244 11.25L6.36309 9.56944C6.67759 9.29988 6.71401 8.8264 6.44444 8.51191C6.17488 8.19741 5.7014 8.16099 5.38691 8.43056L1.88691 11.4306C1.72067 11.573 1.625 11.7811 1.625 12C1.625 12.2189 1.72067 12.427 1.88691 12.5694L5.38691 15.5694C5.7014 15.839 6.17488 15.8026 6.44444 15.4881C6.71401 15.1736 6.67759 14.7001 6.36309 14.4306L4.40244 12.75L15.375 12.75C15.7892 12.75 16.125 12.4142 16.125 12Z" fill="white"/>
              <path d="M9.375 8C9.375 8.70219 9.375 9.05329 9.54351 9.3055C9.61648 9.41471 9.71025 9.50848 9.81946 9.58145C10.0717 9.74996 10.4228 9.74996 11.125 9.74996L15.375 9.74996C16.6176 9.74996 17.625 10.7573 17.625 12C17.625 13.2426 16.6176 14.25 15.375 14.25L11.125 14.25C10.4228 14.25 10.0716 14.25 9.8194 14.4185C9.71023 14.4915 9.6165 14.5852 9.54355 14.6944C9.375 14.9466 9.375 15.2977 9.375 16C9.375 18.8284 9.375 20.2426 10.2537 21.1213C11.1324 22 12.5464 22 15.3748 22L16.3748 22C19.2032 22 20.6174 22 21.4961 21.1213C22.3748 20.2426 22.3748 18.8284 22.3748 16L22.3748 8C22.3748 5.17158 22.3748 3.75736 21.4961 2.87868C20.6174 2 19.2032 2 16.3748 2L15.3748 2C12.5464 2 11.1324 2 10.2537 2.87868C9.375 3.75736 9.375 5.17157 9.375 8Z" fill="white"/>
            </svg>
          </Link></li>
        </ul>
      </div>
      ): (
        <div>
          <div className="w-1/5 min-h-screen bg-slate-800 text-white p-4 fixed text-center top-0">
      <h2 className="text-4xl mt-[10%] font-semibold ">Pantry.ai</h2>
      <ul>
        <li className="mt-[30%] text-xl py-2 cursor-pointer font-semibold" >
          <Link href="/">Home</Link>
        </li>
        <li className="mt-[15%] text-xl py-2 cursor-pointer font-semibold">
          <Link href="/dashboard/inventory">Inventory</Link>
        </li>
        <li className="mt-[15%] text-xl py-2 cursor-pointer font-semibold"><Link href='/dashboard/recipe'>Recipe</Link></li>

        <li className="mt-[15%] text-xl py-2 cursor-pointer font-semibold"><Link href='/signup'>SignUp</Link></li>
        <li className="mt-[15%] text-xl py-2 cursor-pointer font-semibold"><Link href='/signin'>SignIn</Link></li>
       
        
      </ul>
    </div>
      
      <section className="p-24 ml-[20%] w-[80%] relative h-screen">
        <div className="diagonal-background">
          <Image src={pantry} alt="pantry image" layout="fill" objectFit="cover" />
        </div>
        <div className="content-container">
          <h1 className="text-center text-white text-5xl">
            Welcome <span className="text-purple-900"> to </span> my <span className="text-purple-900"> Pantry </span> Tracker <span className="text-purple-900"> App </span>
          </h1>
          <div>
            <div className="mx-auto px-4 sm:px-6 ">
              <div className="mx-auto py-12 sm:py-24 lg:py-15">
                <div className="mt-3 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:space-y-0">

                  <div className="group relative">
                    <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                      <Image src={tracker} alt="image 1" className="h-full w-full object-cover object-center"/>
                    </div>
                  </div>
                  <div className="group relative">
                    <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                      <Image src={fruit} alt="fruit image" className="h-full w-full object-cover object-center"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
        </div>
        
      )}
      
      <section className="p-24 ml-[20%] w-[80%] relative h-screen">
        <div className="diagonal-background">
          <Image src={pantry} alt="pantry image" layout="fill" objectFit="cover" />
        </div>
        <div className="content-container">
          <h1 className="text-center text-white text-5xl">
            Welcome <span className="text-purple-900"> to </span> my <span className="text-purple-900"> Pantry </span> Tracker <span className="text-purple-900"> App </span>
          </h1>
          <div>
            <div className="mx-auto px-4 sm:px-6 ">
              <div className="mx-auto py-12 sm:py-24 lg:py-15">
                <div className="mt-3 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:space-y-0">

                  <div className="group relative">
                    <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                      <Image src={tracker} alt="image 1" className="h-full w-full object-cover object-center"/>
                    </div>
                  </div>
                  <div className="group relative">
                    <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                      <Image src={fruit} alt="fruit image" className="h-full w-full object-cover object-center"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}