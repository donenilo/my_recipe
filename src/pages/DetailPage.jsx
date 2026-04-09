import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DetailPage.css";

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.meals && data.meals[0]) {
          setMeal(data.meals[0]);
          return;
        }
        setError("Recipe not found.");
      })
      .catch(() => {
        setError("Unable to load this recipe right now.");
      });
  }, [id]);

  if (error)
    return (
      <div className="detail-page-error">
        <div className="error-container">
          <p className="error-icon">⚠️</p>
          <p className="error-message">{error}</p>
          <button className="error-btn" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );

  if (!meal)
    return (
      <div className="detail-page-loading">
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading recipe details...</p>
        </div>
      </div>
    );

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient,
        measure: measure || "",
      });
    }
  }

  const instructionSteps = (meal.strInstructions || "")
    .split(/\r?\n|\.\s+/)
    .map((step) => step.trim())
    .filter(Boolean);

  const prepMinutes = Math.max(10, ingredients.length * 2);
  const cookMinutes = Math.max(20, Math.round(instructionSteps.length * 3));
  const servings = Math.min(8, Math.max(2, Math.ceil(ingredients.length / 3)));

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <article className="detail-card">
        <section className="detail-hero">
          <img src={meal.strMealThumb} alt={meal.strMeal} className="meal-image" />
          <div className="hero-overlay"></div>
          <div className="title-card">
            <h1 className="meal-name">{meal.strMeal}</h1>
          </div>
        </section>

        <section className="meta-strip">
          <div className="meta-item-inline">
            <span className="meta-label">Servings:</span>
            <span className="meta-value">{servings}</span>
          </div>
          <div className="meta-item-inline">
            <span className="meta-label">Prepping Time:</span>
            <span className="meta-value">{prepMinutes} min</span>
          </div>
          <div className="meta-item-inline">
            <span className="meta-label">Cooking Time:</span>
            <span className="meta-value">{cookMinutes} min</span>
          </div>
          <div className="meta-item-inline">
            <span className="meta-label">Origin:</span>
            <span className="meta-value">{meal.strArea}</span>
          </div>
        </section>

        <section className="detail-grid">
          <div className="ingredients-section">
            <div className="section-header-detail">
              <h2>Ingredients</h2>
            </div>
            <ul className="ingredients-list">
              {ingredients.map((item, i) => (
                <li key={i} className="ingredient-item">
                  <span className="ingredient-name">{item.ingredient}</span>
                  <span className="ingredient-measure">{item.measure}</span>
                </li>
              ))}
            </ul>

            {meal.strYoutube && (
              <div className="ingredient-video-wrap">
                <a
                  href={meal.strYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="video-link"
                >
                  Watch Full Video Guide
                </a>
              </div>
            )}
          </div>

          <div className="instructions-section">
            <div className="section-header-detail">
              <h2>Directions</h2>
            </div>
            {/* Paayos po  */}
            <ul className="instructions-content">
              {instructionSteps.map((step, i) => (
                <li key={i} className="instruction-step">
                  {step.endsWith(".") ? step : `${step}.`}
                </li>
              ))}
            </ul>
          </div>
        </section>

      </article>
    </div>
  );
};

export default DetailPage;
