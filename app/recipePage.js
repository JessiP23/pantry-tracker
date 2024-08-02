import { color } from "framer-motion";
import React, { useEffect, useState } from "react";
import './recipe.css';
import Markdown from "react-markdown";

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
        <div className="text-center">
            <form onSubmit={handleSubmit}>
                <label htmlFor="ingredients" className="mb-2 text-lg font-medium text-yellow-50 dark:text-white">Add 3 Ingredients:</label>
                <input
                    type="text"
                    id="ingredients"
                    name="ingredients"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    required
                    color="black"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="carrot, apple, eggs" 
                />
                <button type="submit">Get Recipe</button>
            </form>

            {error && <p>Error: {error}</p>}
            <div className="w-[90%] text-lg">
                {response && (
                    <Markdown className="container-response">
                        {response}
                    </Markdown>
                )}
            </div>
        </div>
    )
}

export default RecipePage