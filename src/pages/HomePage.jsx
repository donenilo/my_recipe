import { useState } from "react";
import { useGetSeafoodListQuery } from "../store/apiSlice";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import "./DetailPage.jsx";

const ITEMS_PER_PAGE = 15;

const HomePage = () => {
  const { data, isLoading, isError } = useGetSeafoodListQuery();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading)
    return (
      <div className="status-container loading">
        <div className="spinner"></div>
        <p>Loading delicious recipes...</p>
      </div>
    );

  if (isError)
    return (
      <div className="status-container error">
        <p>⚠️ Unable to load recipes. Please check your connection.</p>
      </div>
    );

  const meals = data?.meals ?? [];
  const featuredMeals = meals.slice(0, 3);

  const filteredMeals = meals.filter((meal) =>
    meal.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMeals.length / ITEMS_PER_PAGE) || 1;
  const paginatedMeals = filteredMeals.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCardClick = (mealId) => {
    navigate(`/meal/${mealId}`);
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Discover Delicious Recipes</h1>
          <p className="hero-subtitle">Explore amazing seafood recipes from around the world</p>
          <div className="hero-search">
            <input
              type="text"
              placeholder="Search for a recipe..."
              value={searchQuery}
              onChange={handleSearch}
              className="hero-search-input"
            />
            <button className="hero-search-btn">🔍</button>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      {featuredMeals.length > 0 && (
        <section className="featured-section" id="featured">
          <div className="section-header">
            <h2>Featured Recipes</h2>
            <p>Check out our handpicked selection</p>
          </div>
          <div className="featured-grid">
            {featuredMeals.map((meal) => (
              <div
                key={`featured-${meal.idMeal}`}
                className="featured-card"
                onClick={() => handleCardClick(meal.idMeal)}
              >
                <div className="featured-image-wrapper">
                  <img src={meal.strMealThumb} alt={meal.strMeal} />
                  <div className="featured-overlay">
                    <button className="featured-btn">View Recipe</button>
                  </div>
                </div>
                <h3>{meal.strMeal}</h3>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Recipes Section */}
      <section className="recipes-section" id="recipes">
        <div className="section-header">
          <h2>All Recipes</h2>
          <p>Showing {paginatedMeals.length} of {filteredMeals.length} recipes</p>
        </div>

        {/* Recipe Grid */}
        <div className="recipes-grid">
          {paginatedMeals.length > 0 ? (
            paginatedMeals.map((meal) => (
              <div
                key={meal.idMeal}
                className="recipe-card"
                onClick={() => handleCardClick(meal.idMeal)}
              >
                <div className="recipe-image">
                  <img src={meal.strMealThumb} alt={meal.strMeal} />
                  <div className="recipe-overlay">
                    <button className="recipe-btn">View Details</button>
                    
                  </div>
                </div>
                <div className="recipe-content">
                  <h3 className="recipe-title">{meal.strMeal}</h3>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No recipes found. Try a different search.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>

            <div className="pagination-info">
              <span className="current-page">{currentPage}</span>
              <span className="divider">/</span>
              <span className="total-pages">{totalPages}</span>
            </div>

            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;