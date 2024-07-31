import React from "react";

// Take a parameter option from the menu
const Sidebar = ({ selectedOptionFromMenu }) => {
    return (
        <div className="w-1/5 min-h-screen bg-slate-800 text-white p-4 fixed text-center">
        <h2 className="text-4xl mt-[10%] ">Pantry.ai</h2>
        <ul>
            {/* Conditional rendering */}
          <li className="mt-[30%] text-xl py-2" onClick={() => selectedOptionFromMenu('Home')} >Home</li>
          <li className="mt-[15%] text-xl py-2" onClick={() => selectedOptionFromMenu('Inventory')}>Inventory</li>
          <li className="mt-[15%] text-xl py-2" onClick={() => selectedOptionFromMenu('Recipe')}>Recipe</li>
          <li className="mt-[15%] text-xl py-2" onClick={() => selectedOptionFromMenu('Map')}>Map</li>
          <li className="mt-[15%] text-xl py-2" onClick={() => selectedOptionFromMenu('History')}>History</li>
        </ul>
      </div>
    )
}

export default Sidebar;