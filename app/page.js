'use client'
import React, {useState, useEffect} from "react";
import { addDoc, collection, getDocs, onSnapshot, querySnapshot, query, deleteDoc, doc } from "firebase/firestore"; 
import { db } from "./firebase";
import Sidebar from "./sidebar";
import InventoryPage from "./inventory";
import RecipePage from "./recipePage";
import MapPage from "./mapPage";
import HomePage from "./homePage/homePage";
import HistoryPage from "./history/page";

export default function Home() {
  // selected option default home
  const [selectedOptionFromMenu, setSelectedOptionFromMenu] = useState('Home');

  const [items, setItems] = useState([
    // {name: 'Cofee', price: 4.95},
    // {name: 'Movie', price: 28.43},
    // {name: 'Candy', price: 4.5},
  ]);

  const [newItem, setNewItem] = useState({name: '', price: ''})


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

  // Add item to database

  const addItem = async (e) => {
    e.preventDefault();
    if(newItem.name !== '' && newItem.price !== '') {
      await addDoc(collection(db, 'items'), {
        name: newItem.name.trim(),
        price: newItem.price,
      });

      const newItemToAdd = { ...newItem, price: parseFloat(newItem.price) };
      setItems([...items, newItemToAdd]);
      setNewItem({ name: '', price: '' });

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

  // Delete items from database
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, 'items', id)) 
  }

  return (
    <main className="flex min-h-screen">
      <Sidebar selectedOptionFromMenu={setSelectedOptionFromMenu} />
      <div className="w-[80%] ml-[20%] p-24 overflow-auto">
        <div className=" max-w-5xl items-center justify-between font-mono text-sm ">
          {/* <div className="bg-slate-800 p-4 rounded-lg">
            <form className="grid grid-cols-6 items-center text-black">
              <input value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} className="col-span-3 p-3 border" type="text" placeholder="Enter item" />
              <input value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} className="col-span-2 p-3 border mx-3" type="number" placeholder="Enter $" />
              <button onClick={addItem} className="text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl" type="submit">
                +
              </button>
            </form>
            <ul>
              {items.map((item, id) => (
                <li key={ id} className="my-4 w-full flex justify-between bg-slate-950">
                  <div className="p-4 w-full flex justify-between">
                    <span className="capitalize">{item.name}</span>
                    <span>${item.price}</span>
                  </div>
                  <button onClick={() => deleteItem(item.id)} className="ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16">X</button>
                </li>
              ))}
            </ul>
            {items.length < 1 ? ('') : (
              <div className="flex justify-between p-3">
                <span>Total</span>
                <span>${total}</span>
              </div>
            )}
          </div> */}
          {showContentFromSidebar()}
        </div>
      </div>
    </main>
  );
}