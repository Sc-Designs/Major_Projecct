const socket = io();
let marker = {};

let projectId = document.querySelector(".projectId");

socket.emit("project-id", {projectId: projectId.textContent});

let map = L.map('mapSection').setView([0,0],10)

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution: "® Blood_Hub"
}).addTo(map);
if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        let startPoint = {};
        let endPoint = {};
        let routingControl = null;
        let {latitude, longitude} = position.coords;
        startPoint.lat = latitude;
        startPoint.lng = longitude;
        socket.emit('user-location', {latitude, longitude});

        socket.on("received-location", ({ location, id }) => {
          let { latitude, longitude } = location;
          endPoint.lat = latitude;
          endPoint.lng = longitude;
          if(routingControl){
            map.removeControl(routingControl);
            routingControl = null;
          }
       if (startPoint && endPoint) {
         routingControl = L.Routing.control({
           waypoints: [
            L.latLng(startPoint.lat, startPoint.lng), 
            L.latLng(endPoint.lat, endPoint.lng)
        ],
           routeWhileDragging: false,
           draggableWaypoints: false,
         }).addTo(map);
       } else {
         alert("Please enter both start and end locations");
       }
          if (marker[id]) {
            marker[id].setLatLng([latitude, longitude]);
          } else {
            marker[id] = L.marker([latitude, longitude]).addTo(map);
          }
        });
    },(error)=>{
        console.error("error:",error);
    },{
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    })
}

socket.on("disconnected-user",({id})=>{
    if(marker[id]){
        map.removeLayer(marker[id]);
        delete marker[id];
    }
});