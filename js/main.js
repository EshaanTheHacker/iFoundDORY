"use strict";
//API key and URL for GeoCoding.
let apiKey = "e26cc5542f9a4a37b08acf74fbfcc103";
let url = `https://api.opencagedata.com/geocode/v1/json`;
mapboxgl.accessToken = "pk.eyJ1IjoiZXNoYWFubSIsImEiOiJja29pNTZud3MxNXByMnFsamRiMmtnamh5In0.V9XQK4TRnWc8Wt9BqlPemw";
const STOPS_DATA_KEY = "stopsdata";
const COORDINATES_KEY = "coordinates";
let results= [];
let map = new mapboxgl.Map({
container: 'map', // Container ID
style: 'mapbox://styles/mapbox/dark-v10', // Map style to use
center: [145.230643,-37.867504], // Starting position [lng, lat]
zoom: 12 // Starting zoom level
});
let coordinates = document.getElementById('coordinates');
 // Initialize a new marker
 let marker = new mapboxgl.Marker({
    draggable: true
    })
    .setLngLat([145.230643,-37.867504])
    .addTo(map);
     
    function onDragEnd() {
    let lngLat = marker.getLngLat();
    coordinates.style.display = 'block';
    coordinates.innerHTML =
    'Longitude: ' + lngLat.lng + '<br />Latitude: ' + lngLat.lat;
    }
     
    marker.on('dragend', onDragEnd);
    

// Initialize the geocoder
let geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    marker: {
        color: 'Purple'
    },
    reverseGeocode: true,
    mapboxgl: mapboxgl
    
});
geocoder.on('result', function(result) {
    console.log(result)
    results.push(result);
    let popup = new mapboxgl.Popup({ offset: 45 });
		popup.setText(results);
    ;
  })

// accessToken: mapboxgl.accessToken, // Set the access token
// mapboxgl: mapboxgl, // Set the mapbox-gl instance
// marker: false, // Do not use the default marker style
// placeholder: '     Search here', // Placeholder text for the search bar
// bbox: [113.338953078, -43.6345972634, 153.569469029, -10.6681857235], // Boundary for Berkeley
// proximity: {
// longitude: 113.338953078,
// latitude: -10.6681857235
// } // Coordinates of AUS
// });
 
// Add the geocoder to the map
map.addControl(geocoder);
 
// After the map style has loaded on the page,
// add a source layer and default styling for a single point
map.on('load', function () {
map.addSource('single-point', {
'type': 'geojson',
'data': {
'type': 'FeatureCollection',
'features': []
}
});
});

// let Coordinates= [map.addSource('single point')];
// let longitude=113.338953078
// let latitude= -10.6681857235
// $`https://api.mapbox.com/geocoding/v5/mapbox.places/-73.989,40.733.json?access_token=pk.eyJ1IjoiZXNoYWFubSIsImEiOiJja29pNTZud3MxNXByMnFsamRiMmtnamh5In0.V9XQK4TRnWc8Wt9BqlPemw`
// get/geocoding/v5/{endpoint}/{longitude},{latitude}.json
//This function is responsible for adding a red marker when clicked Add Stop at the center of the map.
let marker1;
let lat, lng;
function addMarker() {
	if (marker1) {
		marker1.remove();
	}
	//Center map by giving lng and lat a getcenter method.
	 lng = map.getCenter().lng;
	 lat = map.getCenter().lat;
	// Give new marker instance.
	marker1 = new mapboxgl.Marker(
		{
			color: "#FF5233",
			draggable: true
			//Use lng and lat to center map. 
		}).setLngLat([lng, lat])
		// Set a popup that will describe what to do with the marker.
		.setPopup(new mapboxgl.Popup().setHTML('Choose your Stop'))
		//Add it to the map.
		.addTo(map);
}
let stops = [];
function displayStops() {
	//Run a for loop through the array stops.
	for (let i = 0; i < stops.length; i++) {
		// Set a variable that can be used to run through the stops array. 
		let location = stops[i];
		//Create a marker instance
		let marker1 = new mapboxgl.Marker({ "color": "#334FFF" });
		// set marker to the coordinates where the location is.
		marker1.setLngLat(location.coordinates);
		//Set a popup that will display user's stop address.
		let popup = new mapboxgl.Popup({ offset: 45 });
		popup.setText(location.description);
		//Set popup to the marker.
		marker1.setPopup(popup);
		// Display the marker.
		marker1.addTo(map);
		// Display the popup.
		popup.addTo(map);}
    };
    //This function is responsible for pushing in coordinates and description into the stops array.
    function pushStop(lng, lat, description1, stops) {
        // Define the object.
        let stopToPush =
        {
            coordinates: [lng, lat],
            description: description1
        }
        //push the object into the stops array.
        stops.push(stopToPush);
    }
    // This function is responsible for setting a stop at a chosen location.
    function setStop() {
        //give lat and lng a value.
        lat = marker1._lngLat.lat;
        lng = marker1._lngLat.lng;
        // call back data object
        data =
        {
            q: `${lat},${lng}`,
            key: apiKey,
            jsonp: "showData"
        };
        // Run webService request 
        webServiceRequest(url, data);}

//This function is responsible for sending a web request for reverse geocoding
function webServiceRequest(url, data) {
	// Build URL parameters from data object.
	let params = "";
	// For each key in data object...
	for (let key in data) {
		if (data.hasOwnProperty(key)) {
			if (params.length == 0) {
				// First parameter starts with '?'
				params += "?";
			}
			else {
				// Subsequent parameter separated by '&'
				params += "&";
			}

			let encodedKey = encodeURIComponent(key);
			let encodedValue = encodeURIComponent(data[key]);

			params += encodedKey + "=" + encodedValue;
		}
	}
	let script = document.createElement('script');
	script.src = url + params;
	document.body.appendChild(script);
}      
// give the data object a key and call back showData
let data =
{
	//q: `${LAT},${LNG}`,
	key: apiKey,
	//redirect the data derived to showData function
	jsonp: "showData"
};
// data was here
//webServiceRequest(url,data);
let description1;
function showData(data) {
	console.log(data);
	//give description one the value 
	description1 = data.results[0].formatted;
	//push the stops
	pushStop(lng, lat, description1, stops);
	//Display the stops when the function is run
	displayStops();

	// Store Stop Data.
	storeData(stops, STOPS_DATA_KEY);
}  
//checkLocalStorage function
function checkData(key) { //Name: checkData ; Purpose: see if there is something in localStorage ; Parameter: key ; Returns: ;
    let data = localStorage.getItem(key)
    if (data !== null) {
        return true;
    }
    else
        return false;

}
//updateLocalStorage function
function storeData(data, key) {
    if (typeof (data) === 'object') {
        data = JSON.stringify(data);
    }
    localStorage.setItem(key, data);
}

//getStoredData function
function retrieveData(key) {
    let data = localStorage.getItem(key);
    try {
        data = JSON.parse(data);
    }
    catch (error) {
        console.log(error);
    }
    finally {
        return data;
    }
}
let stopsData = retrieveData(STOPS_DATA_KEY);

if (checkData(STOPS_DATA_KEY) == true) {
    stops = stopsData;
}

function removeMarker() {
	//confirm if the stop wants to be removed
    
            if (confirm('Are you sure you want to remove this stop?') == true) {
                //removes the stop from the stop array
                stops.pop();
                //updates local storage.
                storeData(stops, STOPS_DATA_KEY);
                //reloads to update the markers
                window.location="index.html"
                removesMarker();
            }
}

function removesMarker(){
    marker1.remove();
    window.location="index.html"
}
displayStops();
// function displayStops(data) {
//     //references
    
//     let stopsRef = document.getElementById('stops');

    
//     //reseting stops queue
//     stopsRef.innerHTML = '';

//     for (let i = 1; i < 5; i++) {
//         stopsRef.innerHTML += `<li class="mdl-list__item mdl-list__item--three-line">
//             <span class="mdl-list__item-primary-content">
//                 <i class="material-icons mdl-list__item-avatar">fmd_good
//                 </i>
//                 <span><strong>Stop ${i}:</strong> ${data[i].description}</span>
//             </span>
//             <span class="mdl-list__item-secondary-content">
//                 <a class="mdl-list__item-secondary-action" onclick="removeStop(${i})"><i
//                     class="material-icons">remove_circle</i></a>
//             </span>
//         </li>`;
//     }
// }
let to = [lng, lat] //lng, lat
let from = [lng, lat] //lng, lat 

let greenMarker = new mapboxgl.Marker({
    color: 'green'
  })
  .setLngLat(to) // marker position using variable 'to'
  .addTo(map); //add marker to map

let purpleMarker = new mapboxgl.Marker({
    color: 'purple'
  })
  .setLngLat(from) // marker position using variable 'from'
  .addTo(map); //add marker to map

let options = {
  units: 'miles'
}; // units can be degrees, radians, miles, or kilometers, just be sure to change the units in the text box to match. 

let distance = turf.distance(to, from, options);

let value = document.getElementById('map-overlay')
value.innerHTML = "Distance: " + distance.toFixed([2]) + " miles"


map.addControl(new mapboxgl.NavigationControl());  

map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
    enableHighAccuracy: true
    },
    trackUserLocation: true
    })); 
 