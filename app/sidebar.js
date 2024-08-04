import React from "react";
import Link from "next/link";


// Take a parameter option from the menu
const Sidebar = ({ selectedOptionFromMenu }) => {
    return (
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
    )
}

export default Sidebar;