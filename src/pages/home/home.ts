import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { BackgroundMode } from '@ionic-native/background-mode';


declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  map: any;
  marker: any;
  watch: any;
  

  constructor(public navCtrl: NavController, public geolocation: Geolocation, public locationTracker: LocationTrackerProvider,private backgroundMode: BackgroundMode) {
  
    

  }
  ionViewDidLoad(){
    // Inicializa el mapa
    this.getPosition();
  }
  public start() {
    this.backgroundMode.enable();
    // Start Provider background location
    this.locationTracker.startTracking();
    // Cambia el marker del mapa
    this.watch = this.geolocation.watchPosition().subscribe(res =>{
      this.setMyMap(this.locationTracker,this.map,this.marker);
      console.log('Cambió marker');
    });

    
  }

  public stop() {
    // Detiene el provider
    this.locationTracker.stopTracking();
    // Detiene el cambio de markers
    this.watch.unsubscribe();
    console.log('Stop watch');
    this.backgroundMode.disable();
  }

  
  getPosition():any{
    this.geolocation.getCurrentPosition().then(response => {  
        this.loadMap(response); 
        
    })
    
  }

  loadMap(position: Geoposition){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    
    
    // Se asigna el elemento donde irá el mapa
    let mapEle: HTMLElement = document.getElementById('map');
  
    // Se establecen cordenadas
    let myLatLng = {lat: latitude, lng: longitude};
  
  // Crea el mapa
  this.map = new google.maps.Map(mapEle, {
    center: myLatLng,
    zoom: 17
  });
  
  // Agrega el marker
  google.maps.event.addListenerOnce(this.map, 'idle', () => {
       this.marker = new google.maps.Marker({
        position: myLatLng,
        map: this.map
      });
      
    
    
    mapEle.classList.add('show-map');
  });
  }

  setMyMap(res: LocationTrackerProvider, map, marker) {
    // Establece coords desde el provider
    let myLatLng = {lat: res.lat, lng: res.lng};
    // Si hay un marker lo elimina para crear otro
    if (marker) {
      marker.setMap(null);
      this.marker = new google.maps.Marker({
        position: myLatLng,
        map: map
      });
    }
    
    // Centra el mapa y da coordenadas
    map.setCenter(myLatLng);
    map.panTo(myLatLng);
     console.log('marker cambiado a :'+ myLatLng.lat + ' ' + myLatLng.lng);
     
    // this.sendCoords(latLng);
 
  }
}
