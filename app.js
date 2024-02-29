const express = require('express');
const ejs = require('ejs');
const path = require('path');

let app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render('home');
});

app.listen(3000, function() {
  console.log('TechTravel running successfully on port 3000!');
})
