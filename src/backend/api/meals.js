const express = require("express");
const app = express();
const router = express.Router();
const pool = require("./../database");
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get("/", (request, response) => {
  const options = {
    maxPrice: request.query.maxPrice,
    availableReservations: request.query.availableReservations,
    title: request.query.title,
    createdAfter: request.query.createdAfter,
    limit: request.query.limit
  };

  const query = request.query;

  for(let key in query){
      if(!options.hasOwnProperty(key)){
        response.status(400).json({ msg: "There is no such query parameter"});
      }
  }

  const conditions = [];

  if(typeof options.maxPrice !== 'undefined'){
    conditions.push(`Price < ${Number(options.maxPrice)}`);
  }
  // if(typeof options.availableReservations !== 'undefined') {
  //   conditions.push(` Price < ${Number(options.maxPrice)}`);
  // }
  if(typeof options.title !== 'undefined') {
    conditions.push(`Title LIKE '%${options.title}%'`);
  }
  if(typeof options.createdAfter !== 'undefined') {
    conditions.push(`CreatedDate > '${options.createdAfter}'`);
  }

  let stringOfConditions = conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';

  if(typeof options.limit !== 'undefined'){
    stringOfConditions += ` LIMIT ${Number(options.limit)}`;
  }  

  pool.query(`SELECT * FROM meal ${stringOfConditions}`, function(error, results, fields) {
    if(error) {
      console.log(error);
      throw error;
    }
    if(!error){
      response.send(results);
    }   
  });  
});

// router.get("/:id", (request, response) => {
//   const id = request.params.id;
//   pool.query("SELECT * FROM meal WHERE Id = ?", id, function(error, results, fields) {
//     if(error) {
//       console.log(error);
//       throw error;
//     }
//     if(!error){
//       response.json(results);
//     }
//   });
// });

router.get("/:id", (request, response) => {
  const id = request.params.id;
  pool.query(`SELECT Meal.*, Meal.MaxReservations > IFNULL(sum(Reservation.NumberOfGuests), 0) as isReservationAvailable FROM Meal LEFT JOIN Reservation ON Meal.Id = Reservation.MealId WHERE Meal.Id = ${id} GROUP BY Meal.Id`, function(error, results, fields) {
    if(error) {
      console.log(error);
      throw error;
    }
    if(!error){
      response.json(results);
    }
  });
});

router.post("/add-meal", (request, response) => {
  // Example for meal
  // {
    // "Title": "Chips", 
    // "Description": "Chips from pack", 
    // "Location" : "London", 
    // "When": "23.10.2019", 
    // "MaxReservations": "5", 
    // "Price" : "3.23", 
    // "CreatedDate" : "21.10.2019"
  // } 
  const newMeal = request.body;

  pool.query(`INSERT INTO meal SET ?`, newMeal, function(error, results, fields) {
    if(error) {
      console.log(error);
      throw error;
    }
    if(!error){
      response.send("Meal added successfully! Congrats!");
    }
  });
});

router.put("/:id", (request, response) => {
  const newMeal = request.body;
  const id = request.params.id;

  // Example for meal
  // {
  //   "Location" : "Copenhagen", 
  //   "MaxReservations": "5"
  // } 
  
  let keys = Object.keys(newMeal); //list the properties of an object from req.body
  let arrayOfNewValues = keys.map(x => `${x} = "${newMeal[x]}"`); //form array [key = new value]
  let listOfNewValues = arrayOfNewValues.join(', '); //to the mySQL format

  const query = `UPDATE meal SET ${listOfNewValues} WHERE Id = ${id}`
  pool.query(query, function(error, results, fields) {
    if(error) {
      console.log(error);
      throw error;
    }
    if(!error){
      response.send("Meal updated successfully! Congrats!");
    }
  });
});

router.delete("/:id", (request, response) => {
  const id = request.params.id;

  pool.query(`DELETE FROM meal WHERE Id = ${id}`, function(error, results, fields) {
    if(error) {
      console.log(error);
      throw error;
    }
    if(!error){
      response.send("Meal deleted successfully!");
    }
  });
});


module.exports = router;
