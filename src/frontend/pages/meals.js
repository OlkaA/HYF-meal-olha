function renderMeals(req, router) {
    fetch('/api/meals/')
    .then(res => res.json())
    .then(meals => {
      console.log(meals);

      document.body.innerHTML = 
      `<div class="meals-wrapper">
        <p>Choose what dish you want to order</p>
        <ul id="meals" class="meals meals-detailed"></ul>
        <ul class="menu">
          <li><a href="/">Go back to the home page</a></li>
        </ul>
      <div>`;
                   
      const ulMeals = document.getElementById('meals');
      meals.forEach(meal => {
        let liMeal = document.createElement('li');
        liMeal.innerHTML = `<img class="meal-image"
                            src="https://source.unsplash.com/400x200?${meal.Title}"
                            alt="${meal.Title}" />
                            <div class="info">                             
                              <div class="title">${meal.Title}</div>
                              <div class="description">${meal.Description}</div>
                              <div class="link">
                                <a href="/meals/${meal.Id}">Order the meal</a>
                              </div>
                              <div class="location-price">
                                <i class="fas fa-map-marker-alt"></i>${meal.Location}  •  
                                <i class="fas fa-hand-holding-usd"></i>$${meal.Price}
                              </div>
                            </div>
                            `;
        ulMeals.appendChild(liMeal);
      })
    });
  }
   
  export default renderMeals;
  