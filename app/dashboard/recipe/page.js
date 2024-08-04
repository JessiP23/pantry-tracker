'use client'
import React, { useEffect, useState } from "react";
import './recipe.css';
import Markdown from "react-markdown";
import Link from "next/link";

const RecipePage = () => {
    const [ingredients, setIngredients] = useState('');
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const ingredientArray = ingredients.split(",").map(item => item.trim());
        console.log('Ingredients:', ingredientArray);

        try {
            const res = await fetch("http://127.0.0.1:5000/generate", {  // Update to your Flask server URL
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ingredients: ingredientArray }),
            });

            if (!res.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await res.json();
            console.log('Response Data:', data);
            setResponse(JSON.stringify(data, null, 2)); 
        } catch(err) {
            setError(err.message);
        }
    };


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
                <li className="mt-[15%] text-xl py-2 cursor-pointer font-semibold">Recipe</li>
                </ul>
            </div>
            <div className="text-center w-[75%] ml-[23%] mt-[5%]">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="ingredients" className="text-lg font-medium text-yellow-50 dark:text-white">
                        Please add 3 ingredients to create a recipe:
                    </label>
                    <input
                        type="text"
                        id="ingredients"
                        name="ingredients"
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        required
                        color="black"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-3xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-5" placeholder="carrot, apple, eggs" 
                    />
                    <button type="submit" className="mt-5 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white font-bold py-2 px-4 rounded-full shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl mb-6">Get Recipe</button>
                </form>

                {error && <p>Error: {error}</p>}
                <div className="w-[100%] text-lg">
                    {response && (
                        <Markdown>
                            {response}
                        </Markdown>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RecipePage