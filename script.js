let map;
let path = [];
let polyline;
let polygon;
let watchID;
let distanceCovered = 0;
let areaInAcres = 0;
let lastPosition = null;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 18,
        center: { lat: 0, lng: 0 },
        mapTypeId: "satellite",
    });

    polyline = new google.maps.Polyline({
        map: map,
        path: path,
        strokeColor: "#FF0000",
        strokeWeight: 2,
    });
}

function startTracking() {
    if (navigator.geolocation) {
        watchID = navigator.geolocation.watchPosition(
            (position) => {
                let lat = position.coords.latitude;
                let lng = position.coords.longitude;
                let newPoint = new google.maps.LatLng(lat, lng);
                
                if (lastPosition) {
                    let segmentDistance = google.maps.geometry.spherical.computeDistanceBetween(lastPosition, newPoint);
                    distanceCovered += segmentDistance;
                }

                lastPosition = newPoint;
                path.push(newPoint);
                polyline.setPath(path);
                
                map.setCenter(newPoint);
                
                if (path.length > 2) {
                    calculateArea();
                }

                document.getElementById("distance").innerText = distanceCovered.toFixed(2);
            },
            (error) => {
                alert("Error in getting location: " + error.message);
            },
            { enableHighAccuracy: true }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function stopTracking() {
    if (watchID) {
        navigator.geolocation.clearWatch(watchID);
        watchID = null;
    }
    if (path.length > 2) {
        drawPolygon();
    }
}

function drawPolygon() {
    if (polygon) {
        polygon.setMap(null);
    }
    polygon = new google.maps.Polygon({
        map: map,
        paths: path,
        strokeColor: "#00FF00",
        strokeWeight: 2,
        fillColor: "#00FF00",
        fillOpacity: 0.4,
    });
    calculateArea();
}

function calculateArea() {
    let googleArea = google.maps.geometry.spherical.computeArea(path);
    areaInAcres = googleArea * 0.000247105; // Convert square meters to acres
    document.getElementById("area").innerText = areaInAcres.toFixed(2);
}

function saveMap() {
    let mapContainer = document.getElementById("map-container");

    html2canvas(mapContainer).then((canvas) => {
        let link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "walking_area.png";
        link.click();
    });
}

window.onload = initMap;
