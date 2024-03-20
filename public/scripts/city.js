// Dynamically update the map according to the city name
let cityName = document.getElementById('cityData').dataset.cityname;
cityName = cityName.split(',')[0];
const maps = 'https://maps.google.com/maps?q=' + encodeURIComponent(cityName) + '&t=&z=13&ie=UTF8&iwloc=&output=embed';
document.querySelector('.map').src = maps;

// Construct the hotels URL with the city name
const hotels = 'https://www.google.com/travel/hotels/' + encodeURIComponent(cityName);
document.querySelector('.hotels').href = hotels;

// Construct the food & drink recommendations
const foods = 'https://www.yelp.com/search?find_desc=Dinner+And+Drinks&find_loc=' + encodeURIComponent(cityName);
document.querySelector('.foods').src = foods;

// Construct the attractions recommendations
const attractions = `https://www.yelp.com/search?find_desc=Attractions&find_loc=${encodeURIComponent(cityName)}`;
document.querySelector('.attractions').src = attractions;

// Setting up the tabs
let el = document.querySelector('.tabs');
let instance = M.Tabs.init(el, {});
// Initialize sidenav
document.addEventListener('DOMContentLoaded', function() {
  let elems = document.querySelectorAll('.sidenav');
  let instances = M.Sidenav.init(elems);
});

// Get reference to the iframe and the loader
const iframe = document.getElementById('attractions-frame');
const loader = document.getElementById('loader');

// Hide the loader when the iframe is loaded
iframe.onload = function() {
  loader.style.display = 'none';
};