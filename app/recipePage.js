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
            <h1>Recipe Page</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="ingredients">Ingredients (comma-separated):</label>
                <input
                    type="text"
                    id="ingredients"
                    name="ingredients"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    required
                    color="black"
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