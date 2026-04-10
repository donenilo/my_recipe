export const fetchSeafoodList = async () => {
  const response = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood");
  const data = await response.json();
  return data.meals;
};

export const fetchMealDetails = async (id) => {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const data = await response.json();
  return data.meals[0];
};