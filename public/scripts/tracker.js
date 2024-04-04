// Listen for the form submission event and prevent the default form submission behavior
document.getElementById('trackingForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Get the selected tracker type (train or airplane) and the input ID
  const trackerType = document.querySelector('input[name="trackerType"]:checked').value;
  const inputID = document.getElementById('trackingID').value.trim();
  const resultsDiv = document.getElementById('trackingResults');

  // Alert if the ID input field is empty
  if (!inputID) {
    alert('Please enter a flight or train identifier.');
    return;
  }

  // Display a loading message while data is being fetched
  resultsDiv.innerHTML = '<p>Loading...</p>'; 

  // Determine which API to call based on the selected tracker type
  if (trackerType === 'train') {
    fetchAmtrakData(inputID, resultsDiv);
  } else if (trackerType === 'airplane') {
    fetchAviationStackData(inputID, resultsDiv);
  } else {
    resultsDiv.innerHTML = '<p>Invalid tracker type.</p>';
  }
});

// Function to fetch train data from the server
async function fetchAmtrakData(trainNumber, resultsDiv) {
    try {
        const response = await fetch(`/api/trains/${trainNumber}`);
        if(response.ok) {
            const trainData = await response.json();
            // Display the train data in resultsDiv, focusing on coordinates
            resultsDiv.innerHTML = `<p>Train Coordinates: Latitude ${trainData.latitude}, Longitude ${trainData.longitude}</p>`;
        } else {
            resultsDiv.innerHTML = '<p>Train data not found or error in response.</p>';
        }
    } catch (error) {
        resultsDiv.innerHTML = '<p>Error retrieving train data. Please try again.</p>';
    }
}

// Function to fetch flight data from the server
async function fetchAviationStackData(flightIATA, resultsDiv) {
  try {
    const response = await fetch(`/api/flights/${flightIATA}`);
    if(response.ok) {
        const flightData = await response.json();
        if(flightData && flightData.latitude !== undefined && flightData.longitude !== undefined) {
            // Display the flight data in resultsDiv, focusing on coordinates
            resultsDiv.innerHTML = `<p>Flight Coordinates: Latitude ${flightData.latitude}, Longitude ${flightData.longitude}</p>`;
        } else {
            resultsDiv.innerHTML = '<p>Flight coordinates not found in the response.</p>';
        }
    } else {
        resultsDiv.innerHTML = `<p>Error retrieving flight data: ${response.statusText}</p>`;
    }
  } catch (error) {
    resultsDiv.innerHTML = '<p>Error retrieving flight data. Please try again.</p>';
  }
}



//both these functions are placeholders for more functionality
function displayTrainData(trainData, container) {
  // Assuming the latitude and longitude are always in the last 'stations' entry
  const lastStation = trainData['20'][0].stations[trainData['20'][0].stations.length - 1]; 

  const div = document.createElement('div');
  div.className = 'tracking-info';
  div.innerHTML = `
    <p>Train ID: ${trainData['20'][0].trainID || 'Unavailable'}</p>
    <p>Current Location: Latitude ${lastStation.lat || 'Unavailable'}, Longitude ${lastStation.lon || 'Unavailable'}</p>
    <p>Status: ${lastStation.trainTimely || 'Unavailable'}</p>
    <p>Next Station: ${lastStation.name || 'Unavailable'}</p>
    `;
  container.appendChild(div);
}

function displayPlaneData(planeData, container) {
  // Ensure planeData contains the required properties (adjust as needed)
  const div = document.createElement('div');
  div.className = 'tracking-info';
  div.innerHTML = `
    <p>Flight: ${planeData.flight.iata || 'Unavailable'}</p>
    <p>Airline: ${planeData.airline.name || 'Unavailable'}</p>
    <p>Origin: ${planeData.departure.airport || 'Unavailable'}</p>
    <p>Destination: ${planeData.arrival.airport || 'Unavailable'}</p>
    <p>Latitude: ${planeData.live.latitude || 'Unavailable'}</p>
    <p>Longitude: ${planeData.live.longitude || 'Unavailable'}</p>
    <p>Altitude: ${planeData.live.altitude || 'Unavailable'} ft</p>
    <p>Heading: ${planeData.live.direction || 'Unavailable'}°</p>
    <p>Status: ${planeData.flight_status || 'Unavailable'}</p>
  `;
  container.appendChild(div);
}
