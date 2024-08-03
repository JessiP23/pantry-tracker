import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ExpandableCard({
  activeItem,
  onClose,
  updateItemQuantity,
}) {
  const [newQuantity, setNewQuantity] = useState(activeItem.quantity);

  const handleUpdate = () => {
    updateItemQuantity(activeItem.id, newQuantity);
    onClose();
  };

  return (
    <AnimatePresence>
      {activeItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[110]">
          <div className="bg-white p-4 rounded-lg">
            <p>Update quantity for {activeItem.name}:</p>
            <div className="flex justify-end gap-2 mt-4">
              <input
                type="number"
                value={newQuantity}
                onChange={(e) => setNewQuantity(Number(e.target.value))}
                className="px-4 py-2 border rounded text-black"
              />
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-black rounded"
                onClick={handleUpdate}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
