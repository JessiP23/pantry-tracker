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


export default function Home() {

  const [items, setItems] = useState([
    // {name: 'Cofee', price: 4.95},
    // {name: 'Movie', price: 28.43},
    // {name: 'Candy', price: 4.5},
  ]);

  const [total, setTotal] = useState(0);



  // Read items from database

  useEffect(() => {
    const q = query(collection(db, 'items'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArray = []

      querySnapshot.forEach((doc) => {
        itemsArray.push({...doc.data(), id: doc.id})
      })

      setItems(itemsArray);

      // Read total from itemsArray
      const calculateTotal = () => {
        const totalPrice = itemsArray.reduce((sum, item) => sum + parseFloat(item.price), 0)
        setTotal(totalPrice)
      }
      calculateTotal()
      return () => unsubscribe();
    })
  }, [])

  return (
    <main>
      <Sidebar />
      
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