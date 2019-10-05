const express = require("express");
const router = express.Router();
const pool = require("./../database");
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get("/", (request, response) => {
  pool.query(`SELECT * FROM review`, function(error, results, fields) {
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
  const newReview = request.body;

  pool.query(`INSERT INTO review SET ?`, newReview, function(error, results, fields) {
    if(error) {
      console.log(error);
      throw error;
    }
    if(!error){
      response.send("Review added successfully! Congrats!");
    }
  });
});

router.get("/:id", (request, response) => {
  const id = request.params.id;
  pool.query("SELECT * FROM review WHERE Id = ?", id, function(error, results, fields) {
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
  const newReview = request.body;
  const id = request.params.id;
  
  let keys = Object.keys(newReview); //list the properties of an object from req.body
  let arrayOfNewValues = keys.map(x => `${x} = "${newReview[x]}"`); //form array [key = new value]
  let listOfNewValues = arrayOfNewValues.join(', '); //to the mySQL format

  const query = `UPDATE review SET ${listOfNewValues} WHERE Id = ${id}`
  pool.query(query, function(error, results, fields) {
    if(error) {
      console.log(error);
      throw error;
    }
    if(!error){
      response.send("Review updated successfully! Congrats!");
    }
  });
});

router.delete("/:id", (request, response) => {
  const id = request.params.id;

  pool.query(`DELETE FROM review WHERE Id = ${id}`, function(error, results, fields) {
    if(error) {
      console.log(error);
      throw error;
    }
    if(!error){
      response.send("Review deleted successfully!");
    }
  });
});


module.exports = router;
