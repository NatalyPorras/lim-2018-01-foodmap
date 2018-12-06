var map;
var infowindow;
const searchData = document.getElementById('searchData');
const cardContent = document.querySelector('.card-deck');

function initMap() {
  navigator.geolocation.getCurrentPosition(function (posicion) {

    latitud = posicion.coords.latitude;
    longitud = posicion.coords.longitude;

    var textLatitudLongitud = new google.maps.LatLng(latitud, longitud);

    var opcionesMap = {
      center: textLatitudLongitud,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("contentMap"), opcionesMap);
    infowindow = new google.maps.InfoWindow();
    var request = {
      location: textLatitudLongitud,
      radius: 900,
      types: ['restaurant']
    };

    var serviceRestaurant = new google.maps.places.PlacesService(map);
    serviceRestaurant.nearbySearch(request, callBack);
  });
}

  function callBack(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        crearMarcador(results[i]);
      }
    }
  const filterFood = (results, search) => {
    return results.filter((option) => {
      return option.name.toLowerCase().indexOf(search.toLowerCase()) > -1
    })
  }

  searchData.addEventListener('keyup', () => {
    const data = searchData.value;
    let resultado2 = filterFood(results, data);
    cardContent.innerHTML = ''
    resultado2.forEach(element => {
      createCard(element);
    })
  })
}

function crearMarcador(place) {

  var newMarkers = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });
  // console.log(place);
  createCard(place);
  // Evento click para el marcador
  google.maps.event.addListener(newMarkers, 'click', function () {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });

}




const createCard = (place) => {
  var photos = place.photos;
  if (!photos) {
    return;
  }

  const cardPlaces = document.createElement("div");
  cardPlaces.className = "cardContent"
  cardPlaces.innerHTML = ` 
  <div class="card">
    <!-- Button trigger modal -->
    <img class="card-img-top" src="${photos[0].getUrl({ 'maxWidth': 150, 'maxHeight': 150 })}" alt="Card image cap" data-toggle="modal" data-target="#exampleModalCenter${place.id}">

    <!-- Modal -->
  <div class="modal fade" id="exampleModalCenter${place.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div style="width: 100%; height: 200px;" id="map-container-${place.id}" class="map-container"></div>
          <div class="descriptionCard">
          <h5 class="card-title">${place.name}</h5>
          <p class="card-text">Puntuación: ${place.rating}</p>
          <p class="card-text">Dirección: ${place.vicinity}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">OK</button>
        </div>
      </div>
    </div>
  </div>
`
cardContent.appendChild(cardPlaces)
var mapOptionsModal= {
  center: new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng()),
  zoom: 18
};
var mapModal = new google.maps.Map(document.getElementById("map-container-"+place.id), mapOptionsModal);

var marker = new google.maps.Marker({
  map: mapModal,
  position: place.geometry.location
});
}
