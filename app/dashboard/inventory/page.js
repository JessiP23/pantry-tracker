"use client";
import React, { useState, useEffect } from "react";
import { addDoc, collection, getDocs, onSnapshot, querySnapshot, query, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ExpandableCard } from "../../components/ExpandableCard";
import { db } from "../../firebase";
import Link from "next/link";

const InventoryPage = () => {
  const [activeItem, setActiveItem] = useState(null);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "" });
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

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
