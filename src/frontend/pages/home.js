function homeRouter(req, router) {

  fetch('/api/').then(res => res.json())
    .then(meals => {
      document.body.innerHTML = `<h1>All meals</h1>
    <p>MealsSharing can offer you these dishes</p>
    <ul id="meals" class="meals"></ul>
    <ul class="menu">
      <li><a href="/meals">Detailed information about dishes</a></li>
    </ul>`;

      const ulMeals = document.getElementById('meals');
      meals.forEach(meal => {
        let liMeal = document.createElement('li');
        liMeal.innerHTML = `<div><img class="meal-image"
            src="https://source.unsplash.com/200x200?${meal.Title}"
            alt="${meal.Title}"</div>                             
            <div class="meal-title">${meal.Title}</div>
            <div class="meal-info"><i class="fas fa-map-marker-alt"></i>${meal.Location}  •  
            <i class="fas fa-hand-holding-usd"></i>$${meal.Price}</div>
            `;
        ulMeals.appendChild(liMeal);
      })

    });
  document.body.innerHTML = "<h1>Home</h1>";
}

export default homeRouter;