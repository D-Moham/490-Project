document.addEventListener('DOMContentLoaded', function() {
  // Retrieve city name from URL parameter
  var urlParams = new URLSearchParams(window.location.search);
  var cityName = urlParams.get('city');
  
  // Use the city name as needed, filling an input field
  // invoke add destination button click
  document.getElementById('addDestination').click();

  var destinationContainer = document.getElementById('destinationsContainer');
  var inputFields = destinationContainer.getElementsByTagName('input');
  if (inputFields.length > 0) {
      inputFields[0].value = decodeURIComponent(cityName);
  }
});