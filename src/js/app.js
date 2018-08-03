var map;
var infowindow;
const searchData = document.getElementById('searchData');
const cardContent = document.querySelector('.card-columns');

function initMap() {
  navigator.geolocation.getCurrentPosition(function (posicion) {

    latitud = posicion.coords.latitude;
    longitud = posicion.coords.longitude;

    var textLatitudLongitud = new google.maps.LatLng(latitud, longitud);

    var opcionesMap = {
      center: textLatitudLongitud,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("contentMap"), opcionesMap);

    // Creamos el infowindow
    infowindow = new google.maps.InfoWindow();

    // Especificamos la localización, el radio y el tipo de lugares que queremos obtener
    var request = {
      location: textLatitudLongitud,
      radius: 500,
      types: ['restaurant']
    };

    // Creamos el servicio PlaceService y enviamos la petición.
    var service = new google.maps.places.PlacesService(map);

    service.nearbySearch(request, function (results, status) {
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

    });

  });
}


function crearMarcador(place) {

  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });
  // console.log(place);
  createCard(place);
  // Asignamos el evento click del marcador
  google.maps.event.addListener(marker, 'click', function () {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });

}

const createCard = (place) => {
  var photos = place.photos;
  // const nameType = Object.values(place.types);
  // const title = nameType['restaurant'];
  // console.log(title);
  if (!photos) {
    return;
  }
  cardContent.innerHTML += ` 
  <div class="card">
    <div class="card-body">
    <!-- Button trigger modal -->
    <img class="card-img-top" src="${photos[0].getUrl({ 'maxWidth': 350, 'maxHeight': 350 })}" alt="Card image cap" data-toggle="modal" data-target="#exampleModalCenter${place.id}">
    </div>
    <!-- Modal -->
  <div class="modal fade" id="exampleModalCenter${place.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="card-title">${place.name}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div style="width: 600px; height: 400px;" id="map_canvas${place.id}"></div>
          <p class="card-text">${place.rating}</p>
          <p class="card-text">${place.vicinity}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">OK</button>
        </div>
      </div>
    </div>
  </div>
`

  var mapOptions = {
    center: new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng()),
    zoom: 10
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"+place.id), mapOptions);


  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  $('#myModal').on('shown.bs.modal', function () {
      $('#myInput').trigger('focus')
    google.maps.event.trigger(map, "resize");
    map.setCenter(myLatlng);
  })


}





