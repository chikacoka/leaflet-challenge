// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
});

function markerSize(mag) {
    // return Math.sqrt(mag) * 500;
    return mag * mag * 5000;
  

}


// function markerColor(depth) {
//     if (depth < 10) {
//         return 'lime'
//     } else if (depth <= 30) {
//         return 'greenyellow'
//     } else if (depth <= 50) {
//         return 'yellow'
//     } else if (depth <= 70) {
//         return 'gold'
//     } else if (depth <= 90) {
//         return 'orange'
//     } else return 'red'
// };

function markerColor(depth) {
    if (depth >= 90) {
        return 'red'
    } else if (depth >= 70) {
        return 'orange'
    } else if (depth >= 50) {
        return 'gold'
    } else if (depth >= 30) {
        return 'yellow'
    } else if (depth >= 10) {
        return 'greenyellow'
    } else return 'lime'
};


function createFeatures(earthquakeData) {

// Define a function that we want to run once for each feature in the features array.
// Give each feature a popup that describes the place and time of the earthquake.
function onEachFeature(features, layer) {
    // layer.bindPopup(`<h3>${features.properties.place}</h3><hr><p>${new Date(features.properties.time)}</p>`);
    layer.bindPopup(`<h3>Location: ${features.properties.place}</h3><hr><p>Date and Time: ${new Date(features.properties.time)}</p><hr><p>Earthquake Magnitude:${features.properties.mag}</p><p>Depth:${features.geometry.coordinates[2]}</p>`);
    // <hr><p>${new Depth(fatures.geometry.coordinates[2])}</p>
}

function pointToLayer(features, latlng) {
    return L.circle(latlng, 
        {radius: markerSize(features.properties.mag),
        color: markerColor(features.geometry.coordinates[2]),
        fillcolor: markerColor(features.geometry.coordinates[2])})
        
}


// Create a GeoJSON layer that contains the features array on the earthquakeData object.
// Run the onEachFeature function once for each piece of data in the array.
var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer
    
});


// Send our earthquakes layer to the createMap function/
createMap(earthquakes);
}

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

// // Set up the legend.
// var legend = L.control({ position: "bottomright" });
// legend.onAdd = function () {
//     var div = L.DomUtil.create("div", "info legend");
//     var limits = geojson.options.limits;
//     var colors = geojson.options.colors;
//     var labels = [];

//     // Add the minimum and maximum.
//     var legendInfo = "<h1>Population with Children<br />(ages 6-17)</h1>" +
//         "<div class=\"labels\">" +
//         "<div class=\"min\">" + limits[0] + "</div>" +
//         "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
//         "</div>";

//     div.innerHTML = legendInfo;

//     limits.forEach(function (limit, index) {
//         labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
//     });

//     div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//     return div;
// };

// // Adding the legend to the map
// legend.addTo(myMap);

// };



