import { useState } from "react";
import { useGetSeafoodListQuery } from "../store/apiSlice";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const ITEMS_PER_PAGE = 8;

const HomePage = () => {
  const { data, isLoading, isError } = useGetSeafoodListQuery();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) return (
    <div className="status-container">
      <p>Loading your favorite and delicious seafood recipes...</p>
    </div>
  );
  
  if (isError) return (
    <div className="status-container">
      <p>Unable to load recipes. Please check your connection or retry again.</p>
    </div>
  );

  const meals = data?.meals ?? [];
  const featuredRecipes = meals.slice(0, 4);

  const filteredMeals = meals.filter(meal =>
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

  return (
    <div className="main-container">
      {/* Featured Circles Section */}
      <div className="featured-section">
        <div className="featured-grid">
          {featuredRecipes.map(meal => (
            <div key={`featured-${meal.idMeal}`} className="featured-card" onClick={() => navigate(`/meal/${meal.idMeal}`)}>
              <img src={meal.strMealThumb} alt={meal.strMeal} />
              <p className="featured-name">{meal.strMeal}</p> 
            </div>
          ))}
        </div>
      </div>

      {/* !! MAIN RECIPE BOX !! */}
      <div className="recipe-box">
        <div className="box-header">
          <input
            className="search-input"
            type="text"
            placeholder="search"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="recipe-grid">
          {paginatedMeals.map(meal => (
            <div key={meal.idMeal} className="recipe-card" onClick={() => navigate(`/meal/${meal.idMeal}`)}>
              <img src={meal.strMealThumb} alt={meal.strMeal} />
              <p>{meal.strMeal}</p>
            </div>
          ))}
        </div>

        <div className="pagination-controls">
          <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Previous</button>
          <span> Page {currentPage} of {totalPages} </span>
          <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;