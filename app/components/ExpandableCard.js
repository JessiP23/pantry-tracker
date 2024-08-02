"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Assuming you have a method to fetch your inventory items
const fetchInventoryItems = async () => {
  // Replace with your actual data fetching logic
  return [
    {
      id: 1,
      description: "Item 1 Description",
      title: "Item 1",
      src: "/path/to/item1-image.jpg",
      ctaText: "Delete",
    },
    {
      id: 2,
      description: "Item 2 Description",
      title: "Item 2",
      src: "/path/to/item2-image.jpg",
      ctaText: "Delete",
    },
  ];
};

export function ExpandableCard() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [active, setActive] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    async function loadItems() {
      const items = await fetchInventoryItems();
      setInventoryItems(items);
    }
    loadItems();
  }, []);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setActive(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref]);

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    // Implement your delete logic here
    setInventoryItems((prevItems) => prevItems.filter((item) => item.id !== itemToDelete.id));
    setShowDeleteConfirmation(false);
    setItemToDelete(null);
    setActive(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setItemToDelete(null);
  };

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}`}>
                <Image
                  priority
                  width={200}
                  height={200}
                  src={active.src}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>
              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}`}
                      className="text-neutral-600 dark:text-neutral-400"
                    >
                      {active.description}
                    </motion.p>
                  </div>
                  <motion.button
                    layoutId={`button-${active.title}`}
                    className="px-4 py-3 text-sm rounded-full font-bold bg-red-500 text-white"
                    onClick={() => handleDeleteClick(active)}
                  >
                    {active.ctaText}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[110]">
          <div className="bg-white p-4 rounded-lg">
            <p>Are you sure you want to delete {itemToDelete.title}?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <ul className="max-w-2xl mx-auto w-full gap-4">
        {inventoryItems.map((item) => (
          <motion.div
            layoutId={`card-${item.title}`}
            key={`card-${item.title}`}
            onClick={() => setActive(item)}
            className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 flex-col md:flex-row">
              <motion.div layoutId={`image-${item.title}`}>
                <Image
                  width={100}
                  height={100}
                  src={item.src}
                  alt={item.title}
                  className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top"
                />
              </motion.div>
              <div className="">
                <motion.h3
                  layoutId={`title-${item.title}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                >
                  {item.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${item.description}`}
                  className="text-neutral-600 dark:text-neutral-400 text-center md:text-left"
                >
                  {item.description}
                </motion.p>
              </div>
            </div>
            <motion.button
              layoutId={`button-${item.title}`}
              className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-red-500 hover:text-white text-black mt-4 md:mt-0"
            >
              {item.ctaText}
            </motion.button>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
