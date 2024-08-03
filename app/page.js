'use client'
import React, {useState, useEffect} from "react";
import { addDoc, collection, getDocs, onSnapshot, querySnapshot, query, deleteDoc, doc } from "firebase/firestore"; 
import { db } from "./firebase";
import Sidebar from "./sidebar";
import InventoryPage from "./dashboard/inventory/page";
import RecipePage from "./dashboard/recipe/page";
import MapPage from "./mapPage";
import HistoryPage from "./dashboard/app-history/page";
import HomePage from './dashboard/homep/page'


export default function Home() {
  // selected option default home
  const [selectedOptionFromMenu, setSelectedOptionFromMenu] = useState('Home');

  const [items, setItems] = useState([
    // {name: 'Cofee', price: 4.95},
    // {name: 'Movie', price: 28.43},
    // {name: 'Candy', price: 4.5},
  ]);

  const [total, setTotal] = useState(0);

  // render content based on the option selected
  const showContentFromSidebar = () => {
    switch(selectedOptionFromMenu) {
      case 'Home':
        return <HomePage />;
      case 'Inventory':
        return <InventoryPage />
      case 'Recipe':
        return <RecipePage />
      case 'Map':
        return <MapPage />
      case 'History':
        return <HistoryPage />

    }
  }

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
      <Sidebar selectedOptionFromMenu={setSelectedOptionFromMenu} />
      <div>
        <div className="items-center justify-between font-mono text-sm ">
          {showContentFromSidebar()}
        </div>
      </div>
    </main>
  );
}