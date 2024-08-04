'use client'
import React, { use, useEffect, useState } from "react";
import './recipe.css';
import Markdown from "react-markdown";
import Link from "next/link";
import useAuth from "../../hooks/useAuth";
import { useRouter } from "next/navigation";

const RecipePage = () => {
    const [ingredients, setIngredients] = useState('');
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const router = useRouter();
    const {user, loading} = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/signin');
        }
    }, [user, loading, router]);
    
    const signOut = async () => {
        try {
          await useAuth.signOut();
          router.push('/signin')
        } catch(error) {
          console.error(error);
        }
      }

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
            if (data.error) {
                setError(data.error);
                setResponse(null);
            } else {
                setResponse(data.content);
                setError(null);
            }
        } catch(err) {
            setError(err.message);
            setResponse(null);
        }
    };

    const parseResponseData = (content) => {
        // Extract relevant information from the response data
        const lines = content.replace(/\n\n/g, '\n').split('\n');
        return lines.map((line, index) => (
            <p key={index}>{line}</p>
        ));
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
                    <li className="mt-[15%] text-xl py-2 cursor-pointer font-semibold"><Link href='/dashboard/recipe'>Recipe</Link></li>
                    <li className="mt-[15%] text-xl py-2 cursor-pointer font-semibold "><Link href='/signin' onClick={signOut}>
                    <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" className="fixed left-40 bottom-10" xmlns="http://www.w3.org/2000/svg">
                    <path  fillRule="evenodd" clipRule="evenodd" d="M16.125 12C16.125 11.5858 15.7892 11.25 15.375 11.25L4.40244 11.25L6.36309 9.56944C6.67759 9.29988 6.71401 8.8264 6.44444 8.51191C6.17488 8.19741 5.7014 8.16099 5.38691 8.43056L1.88691 11.4306C1.72067 11.573 1.625 11.7811 1.625 12C1.625 12.2189 1.72067 12.427 1.88691 12.5694L5.38691 15.5694C5.7014 15.839 6.17488 15.8026 6.44444 15.4881C6.71401 15.1736 6.67759 14.7001 6.36309 14.4306L4.40244 12.75L15.375 12.75C15.7892 12.75 16.125 12.4142 16.125 12Z" fill="white"/>
                    <path d="M9.375 8C9.375 8.70219 9.375 9.05329 9.54351 9.3055C9.61648 9.41471 9.71025 9.50848 9.81946 9.58145C10.0717 9.74996 10.4228 9.74996 11.125 9.74996L15.375 9.74996C16.6176 9.74996 17.625 10.7573 17.625 12C17.625 13.2426 16.6176 14.25 15.375 14.25L11.125 14.25C10.4228 14.25 10.0716 14.25 9.8194 14.4185C9.71023 14.4915 9.6165 14.5852 9.54355 14.6944C9.375 14.9466 9.375 15.2977 9.375 16C9.375 18.8284 9.375 20.2426 10.2537 21.1213C11.1324 22 12.5464 22 15.3748 22L16.3748 22C19.2032 22 20.6174 22 21.4961 21.1213C22.3748 20.2426 22.3748 18.8284 22.3748 16L22.3748 8C22.3748 5.17158 22.3748 3.75736 21.4961 2.87868C20.6174 2 19.2032 2 16.3748 2L15.3748 2C12.5464 2 11.1324 2 10.2537 2.87868C9.375 3.75736 9.375 5.17157 9.375 8Z" fill="white"/>
                    </svg>
                </Link></li>
                    
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
                        <div>
                            {parseResponseData(response)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RecipePage