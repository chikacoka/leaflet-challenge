// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
// var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
});

function markerSize(mag) {
    // return Math.sqrt(mag) * 500;
    return mag * mag * 5000;
  
}

function markerColor(depth) {
    if (depth >= 90) {
        return '#EA2C2C'
    } else if (depth >= 70) {
        return '#EA822C'
    } else if (depth >= 50) {
        return '#EE9C00'
    } else if (depth >= 30) {
        return '#EECC00'
    } else if (depth >= 10) {
        return '#D4EE00'
    } else return '#98EE00'
};

function createFeatures(earthquakeData) {

// Define a function that we want to run once for each feature in the features array.
// Give each feature a popup that describes the place, time, magnitude, and depth of the earthquake.
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

// Set up the legend.
var legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    var depths = [-10, 10, 30, 50, 70, 90];
    var colors = ["#98EE00", "#D4EE00", "#EECC00", "#EE9C00", "#EA822C","#EA2C2C"];
    for (var i = 0; i< depths.length; i++) {
        div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
            + depths[i] + (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
    }
    return div;
};

// Adding the legend to the map
legend.addTo(myMap);

}




