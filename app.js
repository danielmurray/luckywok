var geocoder;
var map;
var heatmap;
var pointArray = new google.maps.MVCArray();
var heatmap = new google.maps.visualization.HeatmapLayer({
	data: pointArray,
	radius:50
});

function codeAddress() {
	var address = document.getElementById("address").value;
	geocoder.geocode( { 'address': address}, function(results, status) {
	  if (status == google.maps.GeocoderStatus.OK) {
	    map.setCenter(results[0].geometry.location);
	    var marker = new google.maps.Marker({
	        map: map,
	        position: results[0].geometry.location
	    });
	    codePlaces(results[0].geometry.location);
	  } else {
	    alert("Geocode was not successful for the following reason: " + status);
	  }
	});
}

function codePlaces(location){
	var place = document.getElementById("place").value;

	var request = {
		bounds: map.getBounds(),
		keyword: place
	};

	service = new google.maps.places.PlacesService(map);
	service.radarSearch(request, placeMarkers);
}

function placeMarkers(results, status) {

	var placeData = [];

	if (status == google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			var place = results[i];
			placeData.push(place.geometry.location)
			createMarker(results[i])
		}
	}

	console.log(placeData.length)

	var pointArray = new google.maps.MVCArray(placeData);

	heatmap.setData(pointArray);

	heatmap.setMap(map);

	console.log("Success?")
}

function createMarker(result){
	var circle ={
	    path: google.maps.SymbolPath.CIRCLE,
	    fillColor: 'red',
	    fillOpacity: .6,
	    scale: 4.5,
	    strokeColor: 'white',
	    strokeWeight: 1
	};

	var marker = new google.maps.Marker({
        map: map,
        position: result.geometry.location,
        title: result.name,
      	icon: circle
    });
}

function initialize() {
	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(-34.397, 150.644);

	var mapOptions = {
	  zoom: 11,
	  center: latlng
	}
	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	codeAddress()
}