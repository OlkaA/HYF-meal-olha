const express = require("express");
const router = express.Router();
const pool = require("./../database");
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get("/", (request, response) => {
  pool.query(`SELECT * FROM reservation`, function(error, results, fields) {
    if(error) {
      console.log(error);
      throw error;
    }
    if(!error){
      response.send(results);
    }   
  });  
});

router.post("/", (request, response) => {
  const newReservation = request.body;

  newReservation.CreatedDate = new Date();
  pool.query(`INSERT INTO reservation SET ?`, newReservation, function(error, results, fields) {
    if(error) {
      //console.log(error);
      //throw error;
    }
    if(!error){
      response.json({ID: results.insertId});
    }
  });
});

router.get("/:id", (request, response) => {
  const id = request.params.id;
  pool.query("SELECT * FROM reservation WHERE Id = ?", id, function(error, results, fields) {
    if(error) {
      console.log(error);
      throw error;
    }
    if(!error){
      response.json(results);
    }
  });
});

router.put("/:id", (request, response) => {
  const newReservation = request.body;
  const id = request.params.id;
  
  let keys = Object.keys(newReservation); //list the properties of an object from req.body
  let arrayOfNewValues = keys.map(x => `${x} = "${newReservation[x]}"`); //form array [key = new value]
  let listOfNewValues = arrayOfNewValues.join(', '); //to the mySQL format

  const query = `UPDATE reservation SET ${listOfNewValues} WHERE Id = ${id}`
  pool.query(query, function(error, results, fields) {
    if(error) {
      console.log(error);
      throw error;
    }
    if(!error){
      response.send("Reservation updated successfully! Congrats!");
    }
  });
});

router.delete("/:id", (request, response) => {
  const id = request.params.id;

  pool.query(`DELETE FROM reservation WHERE Id = ${id}`, function(error, results, fields) {
    if(error) {
      console.log(error);
      throw error;
    }
    if(!error){
      response.send("Reservation deleted successfully!");
    }
  });
});


module.exports = router;
