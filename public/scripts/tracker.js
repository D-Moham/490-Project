document.getElementById('trackingForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const trackerType = document.querySelector('input[name="trackerType"]:checked').value;
  const inputID = document.getElementById('trackingID').value.trim();
  const resultsDiv = document.getElementById('trackingResults');

  if (!inputID) {
    alert('Please enter a flight or train identifier.');
    return;
  }


  if (trackerType === 'train') {
    fetchAmtrakData(inputID, resultsDiv);
  } else if (trackerType === 'airplane') {
    fetchAviationStackData(inputID, resultsDiv);
  } else {
    resultsDiv.textContent = 'Invalid tracker type.';
  }
});

async function fetchAmtrakData(trainNumber, resultsDiv) {
  try {
    const response = await fetch(`/api/trains/${trainNumber}`);
    if (!response.ok) {
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }
    const trainDataArray = await response.json();
    if (trainDataArray.length > 0) {
      displayTrainData(trainDataArray[0], resultsDiv);
    } else {
      resultsDiv.textContent = 'Train data not found.';
    }
  } catch (error) {
    console.error('Error retrieving train data:', error);
    resultsDiv.textContent = 'Error retrieving train data. Please try again.';
  }
}


// Function to display train data in the DOM
function displayTrainData(trainData, resultsDiv) {
    const { routeName, trainTimely, origName, destName, lat, lon, stations } = trainData;
    const status = stations[stations.length - 1].status;
    const enrouteOrStation = status === "Enroute" ? "En route" : `At station: ${stations[stations.length - 1].name}`;

    resultsDiv.innerHTML = `
        <p>Train Coordinates: Latitude ${parseFloat(lat).toFixed(2)}, Longitude ${parseFloat(lon).toFixed(2)}</p>
        <p>Route: ${routeName}</p>
        <p>Delay: ${trainTimely}</p>
        <p>Origin: ${origName}</p>
        <p>Destination: ${destName}</p>
        <p>Status: ${enrouteOrStation}</p>
    `;
}

// Function to fetch flight data from the server using Aviationstack API
async function fetchAviationStackData(flightIATA, resultsDiv) {
  // Construct the request URL
  const requestURL = `/api/flights/${flightIATA}`;
  
  // Log the request URL for debugging
  console.log(`Making API call to: ${requestURL}`);

  try {
    // Make the API request
    const response = await fetch(requestURL);
    
    // Log the response status for debugging
    console.log(`Response status: ${response.status}`);
    
    // Check if the response was successful
    if (!response.ok) {
      if (response.status === 404) {
        resultsDiv.textContent = 'Flight data not found. Check the flight identifier and try again.';
        return;
      }
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    // Parse the JSON response
    const flightData = await response.json();
    
    // Log the JSON response for debugging
    console.log(flightData);

    // Check if the flight data contains the expected properties
    displayPlaneData(flightData, resultsDiv);
  } catch (error) {
    // Log any errors to the console and display a message to the user
    console.error('Error retrieving flight data:', error);
    resultsDiv.textContent = `Error retrieving flight data. Status: ${error.message}`;
  }
}

function displayPlaneData(planeData, container) {
  // Clear previous results
  container.innerHTML = '';

  // Create the div for displaying the tracking info
  const div = document.createElement('div');
  div.className = 'tracking-info';

  // Check if the live data is available
  if (planeData.live && planeData.live.latitude !== undefined && planeData.live.longitude !== undefined) {
    div.innerHTML += `
      <p>Latitude: ${planeData.live.latitude.toFixed(2)}</p>
      <p>Longitude: ${planeData.live.longitude.toFixed(2)}</p>
      <p>Altitude: ${planeData.live.altitude || 'Unavailable'} ft</p>
      <p>Heading: ${planeData.live.direction || 'Unavailable'}°</p>
    `;
  } else {
    // If live data is not available, display the static data
    div.innerHTML += '<p>Live flight coordinates not available.</p>';
  }

  // Add flight, airline, origin, and destination details that are always available
  div.innerHTML += `
    <p>Flight: ${planeData.flight.iata || 'Unavailable'}</p>
    <p>Airline: ${planeData.airline.name || 'Unavailable'}</p>
    <p>Origin: ${planeData.departure.airport || 'Unavailable'}</p>
    <p>Destination: ${planeData.arrival.airport || 'Unavailable'}</p>
    <p>Status: ${planeData.flight_status || 'Unavailable'}</p>
  `;

  // Append the new tracking info to the container
  container.appendChild(div);
}

