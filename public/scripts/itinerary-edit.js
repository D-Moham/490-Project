document.addEventListener('DOMContentLoaded', function() {
  var datepickerOptions = {
    format: 'mm-dd-yyyy',
    autoClose: true,
    minDate: new Date(),
  };

  // Initialize dropdown
  var select = document.querySelectorAll('select');
  var instances = M.FormSelect.init(select, {});

  // Initialize datepickers for main form and destinations and activities
  var datepickers = document.querySelectorAll('.datepicker');
  datepickers.forEach(function(datepicker) {
    M.Datepicker.init(datepicker, datepickerOptions);
  });

  // Function to update destination indexes
  function updateDestinationIndexes() {
    var destinations = document.querySelectorAll('.destination');
    destinations.forEach(function(destination, index) {
      destination.setAttribute('data-index', index + 1);
      destination.querySelector('h6').innerHTML = `#${index + 1} <a style="margin-left: 2rem;" class="btn removeDestination">Remove</a>`;
      var inputs = destination.querySelectorAll('input, select');
      inputs.forEach(function(input) {
        var name = input.getAttribute('name');
        input.setAttribute('name', name.replace(/\[(\d+)\]/, '[' + index + ']'));
      });
    });
  }

  // Function to update activity indexes
  function updateActivityIndexes(destination) {
    var activities = destination.querySelectorAll('.activity');
    activities.forEach(function(activity, index) {
      activity.querySelector('input[name$="[activityName]"]').setAttribute('name', `destinations[${destination.dataset.index - 1}][activities][${index}][activityName]`);
      activity.querySelector('input[name$="[activityDate]"]').setAttribute('name', `destinations[${destination.dataset.index - 1}][activities][${index}][activityDate]`);
      activity.querySelector('input[name$="[transportation]"]').setAttribute('name', `destinations[${destination.dataset.index - 1}][activities][${index}][transportation]`);
    });
  }

  // Add Destination Button Click Event
  document.getElementById('addDestination').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default form submission

    var destinationCounter = document.querySelectorAll('.destination').length + 1;

    var destinationHTML = `
      <div style="padding-top: 3rem;" class="destination" data-index="${destinationCounter}">
        <h6 class="white-text">#${destinationCounter} <a style="margin-left: 2rem;" class="btn removeDestination">Remove</a></h6> 

        <div class="row">
          <div class="col s4">
            <div class="input-field">
              <input type="text" name="destinations[${destinationCounter - 1}][name]" placeholder="Name" class="autocomplete" required>
            </div>
          </div>
          <div class="col s4">
            <div class="input-field">
              <select name="destinations[${destinationCounter - 1}][transportation]">
                <option value="" disabled selected>Select Transportation</option>
                <option value="Flight">Flight</option>
                <option value="Train">Train</option>
                <option value="Bus">Bus</option>
                <option value="Taxi">Taxi</option>
                <option value="Boat/Ferry">Boat/Ferry</option>
              </select>
            </div>
          </div>
          <div class="col s4">
            <div class="input-field">
              <input type="text" name="destinations[${destinationCounter - 1}][hotel]" placeholder="Hotel Name" required>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col s6">
            <div class="input-field">
              <input type="text" class="datepicker" name="destinations[${destinationCounter - 1}][startDate]" placeholder="Start Date" required>
            </div>
          </div>
          <div class="col s6">
            <div class="input-field">
              <input type="text" class="datepicker" name="destinations[${destinationCounter - 1}][endDate]" placeholder="End Date" required>
            </div>
          </div>
        </div>
        <div class="row"><div class="col s12"><h6 class="white-text">Activities <a style="margin-left: 2rem;" class="btn addActivity">Add</a> </h6></div></div>
        <div class="activitiesContainer">
          <div class="activity row">
            <div class="col s3">
              <div class="input-field">
                <input type="text" name="destinations[${destinationCounter - 1}][activities][0][activityName]" placeholder="Activity Name" required>
              </div>
            </div>
            <div class="col s3">
              <div class="input-field">
                <input type="text" class="datepicker" name="destinations[${destinationCounter - 1}][activities][0][activityDate]" placeholder="Date of Activity" required>
              </div>
            </div>
            <div class="col s3">
              <div class="input-field">
                <select name="destinations[${destinationCounter - 1}][activities][0][transportation]">
                  <option value="" disabled selected>Select Transportation</option>
                  <option value="Walk">Walk</option>
                  <option value="Train">Train</option>
                  <option value="Bus">Bus</option>
                  <option value="Taxi">Taxi</option>
                  <option value="Boat/Ferry">Boat/Ferry</option>
                </select>
              </div>
            </div>
            <div class="col s2">
              <a style="margin-bottom: -3rem;" class="btn removeActivity">Remove</a>
            </div>
          </div>
        </div>
      </div>
    `;
    document.getElementById('destinationsContainer').insertAdjacentHTML('beforeend', destinationHTML);

    // Initialize datepickers for dynamically added destinations
    var datepickers = document.querySelectorAll('.datepicker');
    datepickers.forEach(function(datepicker) {
      M.Datepicker.init(datepicker, datepickerOptions);
    });

    // Initialize dropdown
    var select = document.querySelectorAll('select');
    var instances = M.FormSelect.init(select, {});

    // Initialize autocomplete
    autocompleteInit();

    // Update destination indexes
    updateDestinationIndexes();
  });

  // Delete Destination Button Click Event (for dynamically added destinations)
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('removeDestination')) {
      event.preventDefault(); // Prevent default button behavior
      var destination = event.target.closest('.destination');
      destination.remove();
      // Update destination indexes after removal
      updateDestinationIndexes();
    }
  });

  // Add Activity Button Click Event
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('addActivity')) {
      event.preventDefault(); // Prevent default button behavior
      var destination = event.target.closest('.destination');
      var activitiesContainer = destination.querySelector('.activitiesContainer');
      var activityCounter = activitiesContainer.querySelectorAll('.activity').length;
      var activityHTML = `
        <div class="activity row">
          <div class="col s3">
            <div class="input-field">
              <input type="text" name="destinations[${destination.dataset.index - 1}][activities][${activityCounter}][activityName]" placeholder="Activity Name" required>
            </div>
          </div>
          <div class="col s3">
            <div class="input-field">
              <input type="text" class="datepicker" name="destinations[${destination.dataset.index - 1}][activities][${activityCounter}][activityDate]" placeholder="Date of Activity" required>
            </div>
          </div>
          <div class="col s3">
            <div class="input-field">
              <select name="destinations[${destination.dataset.index - 1}][activities][${activityCounter}][transportation]">
                <option value="" disabled selected>Select Transportation</option>
                <option value="Walk">Walk</option>
                <option value="Train">Train</option>
                <option value="Bus">Bus</option>
                <option value="Taxi">Taxi</option>
                <option value="Boat/Ferry">Boat/Ferry</option>
              </select>
            </div>
          </div>
          <div class="col s3">
            <a style="margin-bottom: -3rem;" class="btn removeActivity">Remove</a>
          </div>
        </div>
      `;
      activitiesContainer.insertAdjacentHTML('beforeend', activityHTML);

      // Initialize datepicker for the last dynamically added activity
      var datepicker = activitiesContainer.lastElementChild.querySelector('.datepicker');
      M.Datepicker.init(datepicker, datepickerOptions);

      // Initialize dropdown
      var select = document.querySelectorAll('select');
      var instances = M.FormSelect.init(select, {});

      // Update activity indexes
      updateActivityIndexes(destination);
    }
  });

  // Remove Activity Button Click Event
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('removeActivity')) {
      event.preventDefault(); // Prevent default button behavior
      var activity = event.target.closest('.activity');
      var destination = event.target.closest('.destination');
      activity.remove();
      // Update activity indexes after removal
      updateActivityIndexes(destination);
    }
  });
});