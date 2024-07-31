import React from "react";

const Sidebar = () => {
    return (
        <div className="w-1/5 min-h-screen bg-slate-800 text-white p-4 fixed text-center">
        <h2 className="text-4xl mt-[10%] ">Pantry.ai</h2>
        <ul>
          <li className="mt-[30%] text-xl py-2">Home</li>
          <li className="mt-[15%] text-xl py-2">Inventory</li>
          <li className="mt-[15%] text-xl py-2">Recipe</li>
          <li className="mt-[15%] text-xl py-2">Map</li>
        </ul>
      </div>
    )
}

export default Sidebar;