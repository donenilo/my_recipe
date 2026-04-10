import { useEffect, useRef, useState } from "react";
import { useGetSeafoodListQuery } from "../store/apiSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./HomePage.css";
 
const ITEMS_PER_PAGE = 15;

const buildPaginationItems = (currentPage, totalPages, delta = 4) => {
  const pages = [];
  const left = currentPage - delta;
  const right = currentPage + delta;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i <= right)) {
      pages.push(i);
    }
  }

  const result = [];
  let prev = null;
  for (const page of pages) {
    if (prev !== null && page - prev > 1) {
      result.push("...");
    }
    result.push(page);
    prev = page;
  }

  return result;
};
 
const HomePage = () => {
  const { data, isLoading, isError } = useGetSeafoodListQuery();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showPaginationHint, setShowPaginationHint] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const paginationPagesRef = useRef(null);
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
 
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
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const hasSearchQuery = normalizedSearchQuery.length > 0;
 
  const featuredMeals = meals.slice(0, 3);
 
  const filteredMeals = meals.filter((meal) =>
    meal.strMeal.toLowerCase().includes(normalizedSearchQuery)
  );
 
  const totalPages = Math.ceil(filteredMeals.length / ITEMS_PER_PAGE) || 1;
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const paginatedMeals = filteredMeals.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );
  const startItem = filteredMeals.length === 0 ? 0 : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1 ;
  const endItem = filteredMeals.length === 0 ? 0 : Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredMeals.length);
  const paginationItems = buildPaginationItems(safeCurrentPage, totalPages);
 
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setSearchParams({ page: 1 });
  };
 
  const handleCardClick = (mealId) => {
    navigate(`/meal/${mealId}`);
  };

  useEffect(() => {
    const element = paginationPagesRef.current;
    if (!element || totalPages <= 1) {
      setShowPaginationHint(false);
      return;
    }

    const updateOverflowState = () => {
      const hasOverflow = element.scrollWidth - element.clientWidth > 1;
      setShowPaginationHint(hasOverflow);
    };

    updateOverflowState();

    let resizeObserver;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updateOverflowState);
      resizeObserver.observe(element);
    }

    window.addEventListener("resize", updateOverflowState);

    return () => {
      window.removeEventListener("resize", updateOverflowState);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [totalPages, safeCurrentPage]);
 
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
          </div>
        </div>
      </section>
 
      {/* Featured Section */}
      {!hasSearchQuery && featuredMeals.length > 0 && (
        <section className="featured-section" id="featured">
          <div className="section-header">
            <h2>Featured Recipes</h2>
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
          <p>
            {filteredMeals.length > 0
            ? `Showing ${startItem}-${endItem} of ${filteredMeals.length} results`
            :"Showing 0 of 0 recipes"}
            </p>
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
          <>
            <div className="pagination">
              <button
                type="button"
                className="pagination-btn"
                onClick={() => setSearchParams({ page: Math.max(safeCurrentPage - 1, 1) })}
                disabled={safeCurrentPage === 1}
                aria-label="Go to previous page"
              >
                «
              </button>

              <div className="pagination-pages" aria-label="Page numbers" ref={paginationPagesRef}>
                {paginationItems.map((item, idx) =>
                  item === "..." ? (
                    <span key={`ellipsis-${idx}`} className="pagination-ellipsis" aria-hidden="true">...</span>
                  ) : (
                    <button
                      type="button"
                      key={item}
                      className={`pagination-page-btn ${safeCurrentPage === item ? "active" : ""}`}
                      onClick={() => setSearchParams({ page: item })}
                      aria-current={safeCurrentPage === item ? "page" : undefined}
                      aria-label={`Go to page ${item}`}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>

              <button
                type="button"
                className="pagination-btn"
                onClick={() => setSearchParams({ page: Math.min(safeCurrentPage + 1, totalPages) })}
                disabled={safeCurrentPage === totalPages}
                aria-label="Go to next page"
              >
                »
              </button>
            </div>

            {showPaginationHint && (
              <p className="pagination-swipe-hint" aria-hidden="true">
                Swipe to scroll through the page numbers
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
};
 
export default HomePage;