const express = require("express"),
  app = express();
  const path = require('path');


app.set('views', path.join(__dirname, 'views'));


//setting view engine to ejs
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

//route for index page
app.get("/", function (req, res) {
    
  res.render("index");
});

//route for magic page
app.get("/magic", function (req, res) {
  res.render("magic");
});

app.listen(8080, function () {
  console.log("Server is running on port 8080 ");
});