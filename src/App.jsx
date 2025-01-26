import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [verse, setVerse] = useState(null);
  const [backgroundUrl, setBackgroundUrl] = useState("");
  const [streak, setStreak] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isFavoritesView, setIsFavoritesView] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [selectedFavorite, setSelectedFavorite] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const today = new Date().toISOString().split("T")[0];
      const storedData = JSON.parse(localStorage.getItem("dailyData"));

      if (storedData && isMounted) {
        if (storedData.date === today) {
          storedData.verse.text = sanitizeText(storedData.verse.text);
          setVerse(storedData.verse);
          setBackgroundUrl(storedData.backgroundUrl);
          setStreak(storedData.streak || 0);

          const storedFavorites =
            JSON.parse(localStorage.getItem("favorites")) || [];
          setFavorites(storedFavorites);
          setIsFavorited(
            storedFavorites.some(
              (fav) => fav.reference === storedData.verse.reference
            )
          );
        } else {
          await fetchVerseAndBackground(today, storedData.streak || 0);
        }
      } else {
        await fetchVerseAndBackground(today, 0);
      }
    };

    const fetchVerseAndBackground = async (today, currentStreak) => {
      try {
        const API_URL = import.meta.env.VITE_BACKEND_URL;
        const verseResponse = await axios.get(`${API_URL}/api/verse`);
        const newVerse = {
          ...verseResponse.data,
          text: sanitizeText(verseResponse.data.text),
        };

        const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;
        const bgResponse = await axios.get("https://api.pexels.com/v1/search", {
          headers: { Authorization: API_KEY },
          params: {
            query: "nature scenery",
            per_page: 10,
          },
        });
        const photos = bgResponse.data.photos;
        const randomPhoto =
          photos[Math.floor(Math.random() * photos.length)].src.original;

        setVerse(newVerse);
        setBackgroundUrl(randomPhoto);
        setStreak(currentStreak);

        localStorage.setItem(
          "dailyData",
          JSON.stringify({
            date: today,
            verse: newVerse,
            backgroundUrl: randomPhoto,
            streak: currentStreak,
          })
        );
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    const sanitizeText = (text) => text.replace(/^"(.+?)"$/, "$1");

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleFavorite = () => {
    const updatedFavorites = [...favorites];
    const favoriteIndex = favorites.findIndex(
      (fav) => fav.reference === verse.reference
    );

    if (favoriteIndex !== -1) {
      updatedFavorites.splice(favoriteIndex, 1);
      setIsFavorited(false);
    } else {
      updatedFavorites.push(verse);
      setIsFavorited(true);
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const toggleFavoritesView = () => {
    setIsFavoritesView(!isFavoritesView);
    adjustButtonPosition(!isFavoritesView);
  };

  const handleFavoriteClick = (favorite) => {
    setSelectedFavorite(favorite);
    setIsFavoritesView(false);
    adjustButtonPosition(false);
  };

  const closeFavoritesView = (event) => {
    if (
      event.target.closest(".favorites-list") ||
      event.target.closest(".favorites-orb-container")
    ) {
      return; // Do nothing if clicking inside the card or button
    }
    setIsFavoritesView(false);
    adjustButtonPosition(false); // Reset button position
  };

  const adjustButtonPosition = (isVisible) => {
    const button = document.querySelector(".favorites-orb-container");
    const list = document.querySelector(".favorites-list");

    if (isVisible && list) {
      const listHeight = list.offsetHeight;
      button.style.top = `${listHeight + 10}px`;
    } else {
      button.style.top = "0"; // Reset button position
    }
  };

  useEffect(() => {
    if (isFavoritesView) {
      document.addEventListener("click", closeFavoritesView);
    } else {
      document.removeEventListener("click", closeFavoritesView);
    }

    return () => {
      document.removeEventListener("click", closeFavoritesView);
    };
  }, [isFavoritesView]);

  if (!verse) {
    return (
      <div className="spinner">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        color: "white",
        textShadow: "0 2px 4px rgba(0, 0, 0, 0.7)",
      }}
    >
      {/* Favorites Button */}
      <div
        className="favorites-orb-container"
        onClick={toggleFavoritesView}
        role="button"
        aria-label="Toggle Favorites View"
      ></div>

      {/* Verse Display */}
      <div className="verse-box">
        <p className="verse-text">
          "{selectedFavorite ? selectedFavorite.text : verse?.text}"
        </p>
        <p className="verse-reference">
          - {selectedFavorite ? selectedFavorite.reference : verse?.reference}
        </p>
        <div
          className="favorite-icon"
          onClick={toggleFavorite}
          title={isFavorited ? "Unfavorite" : "Favorite"}
        >
          {isFavorited ? "❤️" : "🤍"}
        </div>
        <div className="streak-display">🔥 {streak} days</div>
      </div>

      {/* Favorites List */}
      <div className={`favorites-list ${isFavoritesView ? "visible" : ""}`}>
        <h2>Your Favorites</h2>
        {favorites.length === 0 ? (
          <p>No favorites yet.</p>
        ) : (
          favorites.map((fav, index) => (
            <button
              key={index}
              className={`favorite-item-button ${
                selectedFavorite?.reference === fav.reference ? "active" : ""
              }`}
              onClick={() => handleFavoriteClick(fav)}
            >
              {fav.text.slice(0, 40)}... - {fav.reference}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
