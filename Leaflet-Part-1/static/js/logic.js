// Store our API endpoint as queryUrl.
var queryUrl ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
});

function markerSize(magnitude) {
    return Math.sqrt(magnitude) * 50;
    
}

// function markerColor(depth) {
//     return Math.floor(Math.random()*) * 50;

// }

// Loop through the data, and create one marker for each earthquake point.
for (var i = 0; i < features.length; i++) {
    L.circle(features[i].geometry.coordinates, {
        fillOpacity: 0.75,
        color: "white",
        fillColor: "purple",
        // Setting our circle's radius to equal the output of our markerSize() function:
        // This will make our marker's size proportionate to its earthquake magnitude.
        radius: markerSize(features[i].properties.mag)
    }).bindPopup(`<h1>${features[i].properties.place}</h1> <hr> <h3>Time: ${features[i].properties.time.toLocaleString()}</h3>`).addTo(myMap);
}


// function createFeatures(earthquakeData) {

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    // function onEachFeature(feature, layer) {
    //     layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    // }

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    // var earthquakes = L.geoJSON(earthquakeData, {
    //     onEachFeature: onEachFeature
    // });

    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
// }

function createMap(earthquakes) {

    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Create a baseMaps object.
    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    // Create an overlay object to hold our overlay.
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [street, earthquakes]
    });

    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

}




// function createMap(earthquakeLocations) {

// // Create the tile layer that will be the background of our map.
//     var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// });

// // Create a baseMaps object to hold the streetmap layer.
//     var baseMaps = {
//         "Street Map": streetmap
//     };

//     // Create an overlayMaps object to hold the bikeStations layer.
//     var overlayMaps = {
//         "Bike Stations": earthquakeLocations
//     };

//     // Create the map object with options.
//     var map = L.map("map-id", {
//         center: [35.9068333, -117.7348333],
//         zoom: 12,
//         layers: [streetmap, earthquakeLocations]
//     });

//     // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
//     L.control.layers(baseMaps, overlayMaps, {
//         collapsed: false
//     }).addTo(map);
// }