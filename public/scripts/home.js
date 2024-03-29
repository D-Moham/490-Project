let options = {
  data: {
    "New York City, New York": null,
    "Los Angeles, California": null,
    "Charlotte, North Carolina": null,
    "Chicago, Illinois": null,
    "San Francisco, California": null,
    "Las Vegas, Nevada": null,
    "Miami, Florida": null,
    "Orlando, Florida": null,
    "Washington, D.C.": null,
    "Seattle, Washington": null,
    "Boston, Massachusetts": null,
    "San Diego, California": null,
    "Honolulu, Hawaii": null,
    "New Orleans, Louisiana": null,
    "Austin, Texas": null,
    "Nashville, Tennessee": null,
    "Portland, Oregon": null,
    "Philadelphia, Pennsylvania": null,
    "Denver, Colorado": null,
    "Atlanta, Georgia": null,
    "Dallas, Texas": null,
    "Houston, Texas": null,
    "Phoenix, Arizona": null,
    "San Antonio, Texas": null,
    "Charleston, South Carolina": null,
    "Savannah, Georgia": null,
    "San Jose, California": null,
    "Santa Fe, New Mexico": null,
    "Aspen, Colorado": null,
    "Boulder, Colorado": null,
    "Sedona, Arizona": null,
    "Anchorage, Alaska": null,
    "Key West, Florida": null,
    "Miami Beach, Florida": null,
    "Palm Springs, California": null,
    "Asheville, North Carolina": null,
    "Portland, Maine": null,
    "Cape Cod, Massachusetts": null,
    "Grand Canyon, Arizona": null,
    "Yosemite National Park, California": null,
    "Yellowstone National Park, Wyoming": null,
    "Zion National Park, Utah": null,
    "Glacier National Park, Montana": null,
    "Acadia National Park, Maine": null,
    "Bryce Canyon National Park, Utah": null,
    "Moab, Utah": null,
    "Taos, New Mexico": null,
    "Jackson Hole, Wyoming": null,
    "Lake Placid, New York": null,
    "Shenandoah National Park, Virginia": null,
    "Everglades National Park, Florida": null,
    "Big Sur, California": null,
    "Lake Tahoe, California/Nevada": null,
    "Napa Valley, California": null,
    "Sonoma Valley, California": null,
    "Vail, Colorado": null,
    "Park City, Utah": null,
    "Telluride, Colorado": null,
    "Raleigh, North Carolina": null,
  },
  onAutocomplete: function(val) {
    window.location.href = '/city?city=' + encodeURIComponent(val);
  }
};

document.addEventListener('DOMContentLoaded', function() {
  let elems = document.querySelectorAll('.autocomplete');
  let instances = M.Autocomplete.init(elems, options);
});
