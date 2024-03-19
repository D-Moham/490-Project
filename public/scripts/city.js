// Dynamically update the map according to the city name
let cityName = document.getElementById('cityData').dataset.cityname;
cityName = cityName.split(',')[0];
console.log(cityName);
const googleSrc = 'https://maps.google.com/maps?q=' + encodeURIComponent(cityName) + '&t=&z=13&ie=UTF8&iwloc=&output=embed';
document.querySelector('.map').src = googleSrc;

// Setting up the tabs
let el = document.querySelector('.tabs');
let instance = M.Tabs.init(el, {});
// Initialize sidenav
document.addEventListener('DOMContentLoaded', function() {
  let elems = document.querySelectorAll('.sidenav');
  let instances = M.Sidenav.init(elems);
});