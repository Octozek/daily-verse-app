import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [verse, setVerse] = useState(null);
    const [backgroundUrl, setBackgroundUrl] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const today = new Date().toISOString().split('T')[0]; // Get today's date (e.g., "2025-01-04")

            // Check localStorage for existing data and its timestamp
            const storedData = JSON.parse(localStorage.getItem('dailyData'));
            if (storedData && storedData.date === today) {
                // Use stored data if it's from today
                setVerse(storedData.verse);
                setBackgroundUrl(storedData.backgroundUrl);
            } else {
                // Fetch new data if no valid stored data exists
                await fetchVerseAndBackground(today);
            }
        };

        const fetchVerseAndBackground = async (today) => {
            try {
                // Fetch Bible verse
                const API_URL = import.meta.env.VITE_BACKEND_URL; // Backend URL
                const verseResponse = await axios.get(`${API_URL}/api/verse`);
                const newVerse = verseResponse.data;

                // Fetch background image
                const API_KEY = import.meta.env.VITE_PEXELS_API_KEY; // Pexels API key
                const bgResponse = await axios.get(
                    'https://api.pexels.com/v1/search',
                    {
                        headers: { Authorization: API_KEY },
                        params: {
                            query: 'nature', // Keywords for scenic images
                            per_page: 10,
                        },
                    }
                );
                const photos = bgResponse.data.photos;
                const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
                const newBackgroundUrl = randomPhoto.src.original;

                // Save the new data to state and localStorage
                setVerse(newVerse);
                setBackgroundUrl(newBackgroundUrl);
                localStorage.setItem(
                    'dailyData',
                    JSON.stringify({ date: today, verse: newVerse, backgroundUrl: newBackgroundUrl })
                );
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    if (!verse) return <p>Loading...</p>;

    return (
        <div
            className="app-container"
            style={{
                backgroundImage: `url(${backgroundUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                color: 'white',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.7)',
            }}
        >
            <div className="verse-box">
                <p className="verse-text">"{verse.text}"</p>
                <p className="verse-reference">- {verse.reference}</p>
            </div>
        </div>
    );
};

export default App;
