const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const pool = require("./database");
const bodyParser = require("body-parser");

// Serve the built client html
const buildPath = path.join(__dirname, "../../dist");
app.use(express.static(buildPath));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 5000;
const mealsRouter = require("./api/meals");
const reservationsRouter = require("./api/reservations");
const reviewsRouter = require("./api/reviews");

router.use("/meals", mealsRouter);
router.use("/reservations", reservationsRouter);
router.use("/reviews", reviewsRouter);
app.use("/api", router);

app.get("/api", (req, res)=> {
  pool.query("SELECT * FROM meal", function(error, results, fields) {
    if(error) {
      console.log(error);
      throw error;
    }
    if(!error){
      res.json(results);
    }
  });
  //res.send('ok')
});

// Ensures that the client router works on reload aswell.
// Sends all requests back to index.html where the routing lib takes over
app.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "./../../dist/index.html"), function(err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});



app.listen(port, () => console.log(`Server listening on port ${port}!`));
