"use client";
import React, { useState, useEffect } from "react";
import { addDoc, collection, getDocs, onSnapshot, querySnapshot, query, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ExpandableCard } from "../../components/ExpandableCard";
import { db } from "../../firebase";
import Link from "next/link";
import useAuth from "../../hooks/useAuth";
import { useRouter } from "next/navigation";

const InventoryPage = () => {
  const router = useRouter();
  const {user, loading, signOutUser} = useAuth();
  const [activeItem, setActiveItem] = useState(null);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "" });
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  const handleSignOut = async () => {
    console.log('Calling signoutuser function...');
    await signOutUser();
    console.log('SignOutUser function called!')
  }

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/signin');
      } else {
        const q = query(collection(db, "items"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const itemsArray = [];
          querySnapshot.forEach((doc) => {
            itemsArray.push({ id: doc.id, ...doc.data() });
          });
          setItems(itemsArray);
          calculateTotal(itemsArray);
        });
        return () => unsubscribe();
      }
    }
  }, [user, loading, router]);

  const addItem = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "items"), {
        name: newItem.name.trim(),
        quantity: newItem.quantity,
      });
      setItems([...items, { id: Date.now(), ...newItem }]);
      setNewItem({ name: "", quantity: "" });
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "items"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const itemsArray = [];
      querySnapshot.forEach((doc) => {
        itemsArray.push({ id: doc.id, ...doc.data() });
      });
      setItems(itemsArray);
      calculateTotal(itemsArray);
      return () => unsubscribe();
    });
  }, []);

  const calculateTotal = (items) => {
    const totalQuantity = items.reduce((sum, item) => sum + parseFloat(item.quantity), 0);
    setTotal(totalQuantity);
  };

  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, "items", id));
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  const updateItemQuantity = async (id, newQuantity) => {
    try {
      await updateDoc(doc(db, "items", id), { quantity: newQuantity });
      setItems(items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)));
    } catch (error) {
      setError(error.message);
    }
  };

  const filteredItems = items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));


  return (
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
         
          <li className="mt-[15%] text-xl py-2 cursor-pointer font-semibold "><Link href='/signin'>
            <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" className="fixed left-40 bottom-10" xmlns="http://www.w3.org/2000/svg" onClick={handleSignOut}>
              <path  fillRule="evenodd" clipRule="evenodd" d="M16.125 12C16.125 11.5858 15.7892 11.25 15.375 11.25L4.40244 11.25L6.36309 9.56944C6.67759 9.29988 6.71401 8.8264 6.44444 8.51191C6.17488 8.19741 5.7014 8.16099 5.38691 8.43056L1.88691 11.4306C1.72067 11.573 1.625 11.7811 1.625 12C1.625 12.2189 1.72067 12.427 1.88691 12.5694L5.38691 15.5694C5.7014 15.839 6.17488 15.8026 6.44444 15.4881C6.71401 15.1736 6.67759 14.7001 6.36309 14.4306L4.40244 12.75L15.375 12.75C15.7892 12.75 16.125 12.4142 16.125 12Z" fill="white"/>
              <path d="M9.375 8C9.375 8.70219 9.375 9.05329 9.54351 9.3055C9.61648 9.41471 9.71025 9.50848 9.81946 9.58145C10.0717 9.74996 10.4228 9.74996 11.125 9.74996L15.375 9.74996C16.6176 9.74996 17.625 10.7573 17.625 12C17.625 13.2426 16.6176 14.25 15.375 14.25L11.125 14.25C10.4228 14.25 10.0716 14.25 9.8194 14.4185C9.71023 14.4915 9.6165 14.5852 9.54355 14.6944C9.375 14.9466 9.375 15.2977 9.375 16C9.375 18.8284 9.375 20.2426 10.2537 21.1213C11.1324 22 12.5464 22 15.3748 22L16.3748 22C19.2032 22 20.6174 22 21.4961 21.1213C22.3748 20.2426 22.3748 18.8284 22.3748 16L22.3748 8C22.3748 5.17158 22.3748 3.75736 21.4961 2.87868C20.6174 2 19.2032 2 16.3748 2L15.3748 2C12.5464 2 11.1324 2 10.2537 2.87868C9.375 3.75736 9.375 5.17157 9.375 8Z" fill="white"/>
            </svg>
          </Link></li>
        </ul>
      </div>
      <div className="w-[75%] ml-[23%] mt-[5%]">
        <form className="grid grid-cols-6 items-center text-black">
          <input
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="col-span-3 p-3 border"
            type="text"
            placeholder="Enter item"
          />
          <input
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
            className="col-span-2 p-3 border mx-3"
            type="number"
            placeholder="Enter quantity"
          />
          <button
            onClick={addItem}
            className="text-white bg-lime-500 hover:bg-lime-700 p-3 text-xl"
            type="submit"
          >
            +
          </button>
        </form>
        <ul>
          {filteredItems.map((item, id) => (
            <li key={id} className="my-4 w-full flex justify-between bg-slate-600 rounded-lg">
              <div className="p-4 w-full flex justify-between">
                <span className="capitalize">{item.name}</span>
                <span>
                  {item.quantity} {item.name} added to your pantry
                </span>
              </div>
              <button
                onClick={() => setActiveItem(item)}
                className="ml-8 p-4 border-l-2 bg-yellow-500"
              >
                Update
              </button>
              <button
                onClick={() => deleteItem(item.id)}
                className="ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16"
              >
                X
              </button>
            </li>
          ))}
        </ul>
        {activeItem && (
          <ExpandableCard
            activeItem={activeItem}
            onClose={() => setActiveItem(null)}
            updateItemQuantity={updateItemQuantity}
          />
        )}
        {items.length < 1 ? (
          ""
        ) : (
          <div className="flex justify-between p-3">
            <span>Total</span>
            <span>{total} products in inventory</span>
          </div>
        )}

        <form className="grid grid-cols-6 items-center text-black fixed bottom-8">
          <input 
            type="text"
            placeholder="Search ingredients"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="col-span-5  p-3 border"
          />
          <button
            onClick={() => setSearchQuery("")}
            className="text-black bg-slate-700 hover:bg-slate-500 p-3 text-xl col-span-1"
          >
            Clear Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default InventoryPage;
