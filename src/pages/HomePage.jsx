import { useState } from "react";
import { useGetSeafoodListQuery } from "../store/apiSlice";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 8;

const HomePage = () => {
  const { data, isLoading, isError } = useGetSeafoodListQuery();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong!</p>;

  const meals = data?.meals ?? [];

  const filteredMeals = meals.filter(meal =>
    meal.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMeals.length / ITEMS_PER_PAGE);

  const paginatedMeals = filteredMeals.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // reset to page 1 when searching
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div>
      <h1>Seafood Recipes</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search recipes..."
        value={searchQuery}
        onChange={handleSearch}
      />

      {/* Recipe Grid */}
      <div>
        {paginatedMeals.map(meal => (
          <div key={meal.idMeal} onClick={() => navigate(`/meal/${meal.idMeal}`)} style={{ cursor: "pointer" }}>
            <img src={meal.strMealThumb} alt={meal.strMeal} width={100} />
            <p>{meal.strMeal}</p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div>
        <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span> Page {currentPage} of {totalPages} </span>
        <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default HomePage;