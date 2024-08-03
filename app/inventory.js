"use client";
import React, { useState, useEffect } from "react";
import { addDoc, collection, getDocs, onSnapshot, querySnapshot, query, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ExpandableCard } from "./components/ExpandableCard";
import { db } from "./firebase";

const InventoryPage = () => {
  const [activeItem, setActiveItem] = useState(null);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "" });
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");


  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.name !== "" && newItem.quantity !== "") {
      await addDoc(collection(db, "items"), {
        name: newItem.name.trim(),
        quantity: newItem.quantity,
      });

      const newItemToAdd = { ...newItem, price: parseFloat(newItem.quantity) };
      setItems([...items, newItemToAdd]);
      setNewItem({ name: "", quantity: "" });
    }
  };

  useEffect(() => {
    const q = query(collection(db, "items"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArray = [];

      querySnapshot.forEach((doc) => {
        itemsArray.push({ ...doc.data(), id: doc.id });
      });

      setItems(itemsArray);

      const calculateTotal = () => {
        const totalQuantity = itemsArray.reduce(
          (sum, item) => sum + parseFloat(item.quantity),
          0
        );
        setTotal(totalQuantity);
      };
      calculateTotal();
      return () => unsubscribe();
    });
  }, []);

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "items", id));
  };


  const filteredItems = items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));


  const updateItemQuantity = async (id, newQuantity) => {
    const itemRef = doc(db, "items", id);
    await updateDoc(itemRef, { quantity: newQuantity });

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <div className="p-4 rounded-lg">
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
          className="text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl"
          type="submit"
        >
          +
        </button>
      </form>
      <ul>
        {filteredItems.map((item, id) => (
          <li key={id} className="my-4 w-full flex justify-between bg-slate-950">
            <div className="p-4 w-full flex justify-between">
              <span className="capitalize">{item.name}</span>
              <span>
                {item.quantity} {item.name} added to your pantry
              </span>
            </div>
            <button
              onClick={() => setActiveItem(item)}
              className="ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16"
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

      <form className="grid grid-cols-6 items-center text-black">
        <input 
          type="text"
          placeholder="Search ingredients"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="col-span-3 p-3 border"
        />
      </form>
    </div>
  );
};

export default InventoryPage;
