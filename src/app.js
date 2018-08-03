var map;
 var infowindow;

 function initMap()
 {
 // Creamos un mapa con las coordenadas actuales
   navigator.geolocation.getCurrentPosition(function(pos) {

   lat = pos.coords.latitude;
   lon = pos.coords.longitude;

   var myLatlng = new google.maps.LatLng(lat, lon);

   var mapOptions = {
     center: myLatlng,
     zoom: 14,
     mapTypeId: google.maps.MapTypeId.MAP
   };

   map = new google.maps.Map(document.getElementById("mapa"),  mapOptions);

   // Creamos el infowindow
   infowindow = new google.maps.InfoWindow();

   // Especificamos la localización, el radio y el tipo de lugares que queremos obtener
   var request = {
     location: myLatlng,
     radius: 500,
     types: ['restaurant']
   };

   // Creamos el servicio PlaceService y enviamos la petición.
   var service = new google.maps.places.PlacesService(map);

   service.nearbySearch(request, function(results, status) {
     if (status === google.maps.places.PlacesServiceStatus.OK) {
       for (var i = 0; i < results.length; i++) {
         crearMarcador(results[i]);
       }
     }
   });
 });
}

const searchData=document.getElementById('searchData');
 function crearMarcador(place){
  
   var marker = new google.maps.Marker({
     map: map,
     position: place.geometry.location
   });
  console.log(place);
    createCard(place);
 // Asignamos el evento click del marcador
   google.maps.event.addListener(marker, 'click', function() {
     infowindow.setContent(place.name);
     infowindow.open(map, this);
   });

   searchData.addEventListener('keyup',()=>{
    const data = searchData.value;
    filterFood(place,data);
    createCard(place);
   })
   }

  const cardContent= document.querySelector('.card-columns');

   const createCard= (place) => {
    var photos = place.photos;
    if (!photos) {
      return;
    }
   cardContent.innerHTML += ` 
  <div class="card">
    <div class="card-body">
    <!-- Button trigger modal -->
    <img class="card-img-top" src="${photos[0].getUrl({'maxWidth': 300, 'maxHeight': 300})}" alt="Card image cap" data-toggle="modal" data-target="#exampleModalCenter${place.id}">
    </div>
    <!-- Modal -->
  <div class="modal fade" id="exampleModalCenter${place.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
        <h5 class="card-title">${place.name}</h5>
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
   }

   $('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
  })

  const filterFood=(place,search)=>{
    return place.filter((option)=>{
      option.name.toLowerCase().indexOf(search.toLowerCase()) > -1
    })
  }