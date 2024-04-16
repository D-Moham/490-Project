document.getElementById('trackingForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const trackerType = document.querySelector('input[name="trackerType"]:checked').value;
  const inputID = document.getElementById('trackingID').value.trim();
  const resultsDiv = document.getElementById('trackingResults');

  if (!inputID) {
    alert('Please enter a flight or train identifier.');
    return;
  }

  resultsDiv.innerHTML = '<p>Loading...</p>';

  if (trackerType === 'train') {
    fetchAmtrakData(inputID, resultsDiv);
  } else if (trackerType === 'airplane') {
    fetchAviationStackData(inputID, resultsDiv);
  } else {
    resultsDiv.innerHTML = '<p>Invalid tracker type.</p>';
  }
});

// Fetch train data from the server using Amtrak API
async function fetchAmtrakData(trainNumber, resultsDiv) {
    try {
        const response = await fetch(`/api/trains/${trainNumber}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const trainDataArray = await response.json();
        if (trainDataArray.length > 0) {
          // Now we are expecting an array, take the first item for display
          const trainData = trainDataArray[0];
          displayTrainData(trainData, resultsDiv);
        } else {
          resultsDiv.innerHTML = '<p>Train data not found.</p>';
        }
    } catch (error) {
        console.error('Error retrieving train data:', error);
        resultsDiv.innerHTML = '<p>Error retrieving train data. Please try again.</p>';
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
  try {
    const response = await fetch(`/api/flights/${flightIATA}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const flightData = await response.json();
    if (flightData && flightData.latitude !== undefined && flightData.longitude !== undefined) {
        displayPlaneData(flightData, resultsDiv);
    } else {
        resultsDiv.innerHTML = '<p>Flight coordinates not found in the response.</p>';
    }
  } catch (error) {
    console.error('Error retrieving flight data:', error);
    resultsDiv.innerHTML = '<p>Error retrieving flight data. Please try again.</p>';
  }
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

