const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        let {latitude, longitude} = position.coords;
        socket.emit('user-location', {latitude, longitude});
    },(error)=>{
        console.error(error);
    },{
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    })
}
let map = L.map('mapSection').setView([0,0],16)

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution: "Blood_Hub"
}).addTo(map);

let marker = {};

socket.on("recive-location", (data)=>{
    let {id,latitude, longitude} = data;
    map.setView([latitude, longitude])
    if(marker[id]){
        marker[id].setLatLng([latitude, longitude])
    } else {
        marker[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("user-disconnected", (id) => {
  if (marker[id]) {
    map.removeLayer(marker[id]);
    delete marker[id];
  }
});