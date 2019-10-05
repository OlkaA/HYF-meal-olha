function mealsId(req, router) {

  document.body.innerHTML =
    `<div class="meals-wrapper">
        <p >What a nice dish you are going to order!</p>
        <ul class="menu">
          <li><a href="/">Go back to the home page</a></li>
        </ul>
        <div class="content">
          <div class="meal" id="meal"></div>
          <form>
            <div id="form"></div>
            <div id="reservation"></div>
          </form>
        </div>
      <div>`;

  let title = '';

  fetch('/api/meals/' + req.param.id)
    .then(res => res.json())
    .then(array => {
      console.log(array)
      const meal = document.getElementById('meal');
      meal.innerHTML = `
      <img class="meal-image"
      src="https://source.unsplash.com/500x400?${array[0].Title}"
      alt="${array[0].Title}" />
      <div class="info">                             
        <div class="title">${array[0].Title}</div>
        <div class="description">${array[0].Description}</div>
        <div class="location-price">
          <i class="fas fa-map-marker-alt"></i>${array[0].Location}  •  
          <i class="fas fa-hand-holding-usd"></i>$${array[0].Price}
        </div>
      </div>
      `;

      title = array[0].Title;

      const form = document.getElementById('form');

      if (array[0].isReservationAvailable === 1) {
        form.innerHTML =
          `
            Do you want to order the meal? <br />
            Then fill out this form.<br /><br />
            Your name:<br>
            <input type="text" name="name" placeholder="Your name">
            <br>
            Phone Number:<br>
            <input type="tel" name="phone" placeholder="Phone number">
            <br>
            Email:<br>
            <input type="email" name="email" placeholder="Email">
            <br>
            <input type="button" value="Submit">
         `;

        const button = document.querySelector('[type="button"]');
        button.addEventListener('click', () => {

          const name = document.querySelector('[name="name"]');
          const phone = document.querySelector('[name="phone"]');
          const email = document.querySelector('[name="email"]');

          const reservation = document.getElementById('reservation');

          if (name.value !== '' && phone.value !== '' && email.value !== '') {
            fetch('/api/reservations/', {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                headers: {
                  'Content-Type': 'application/json'
                  // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({
                  "Name": name.value,
                  "Telephone": phone.value,
                  "Email": email.value,
                  "MealId": req.param.id
                })
              })
              .then(res => res.json())
              .then(data => {
                console.log(data)
                reservation.innerHTML = `        
            Number of your reservation is ${data.ID}. </br>
            You ordered ${title}. </br>
            We willl contact you very soon.
          `;
                name.value = '';
                phone.value = '';
                email.value = '';
              })
          } else {
            reservation.innerHTML = `        
            Please, fill correctly the form.
          `;
          }
        })
      } else {
        form.innerHTML = `
        Unfortunately, <br />
        we are out of this dish. <br />
        Please, try another.`
      }


    })
};

export default mealsId;