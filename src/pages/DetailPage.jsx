import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [error, setError] = useState("");

  {/* API Call*/}
  useEffect(() => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.meals && data.meals[0]) {
          setMeal(data.meals[0]);
          return;
        }
        {/* Error Handling */}
        setError("Recipe not found.");
      })
      .catch(() => {
        setError("Unable to load this recipe right now.");
      });
  }, [id]);

  if (error) return <p className="loading">{error}</p>;
  if (!meal) return <p className="loading">Loading...</p>;

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure} ${ingredient}`);
    }
  }
  {/* Main Detail Page Container */}
  return (
    <main className="container detail">
      <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
      <div className="detail-header">
        <img src={meal.strMealThumb} alt={meal.strMeal} />
        <div>
          <h1>{meal.strMeal}</h1>
          <p><strong>Category:</strong> {meal.strCategory}</p>
          <p><strong>Origin:</strong> {meal.strArea}</p>
        </div>
      </div>
      <h2>Ingredients</h2>
      <ul className="ingredients">
        {ingredients.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
      <h2>Instructions</h2>
      <p className="instructions">{meal.strInstructions}</p>
    </main>
  );
};

export default DetailPage;
