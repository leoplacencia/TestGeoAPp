import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';


declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  map: any;
  marker: any;
  watch: any;
  

  constructor(public navCtrl: NavController, public geolocation: Geolocation, public locationTracker: LocationTrackerProvider) {
  
    

  }
  public start() {
    this.locationTracker.startTracking();
    this.watch = this.geolocation.watchPosition().subscribe(res =>{
      this.setMyMap(this.locationTracker,this.map,this.marker);
      console.log('Cambia marker');
    });

    
  }

  public stop() {
    this.locationTracker.stopTracking();
    this.watch.unsubscribe();
    console.log('Stop watch');
    
  }

  ionViewDidLoad(){
    this.getPosition();
     
  
  }
  getPosition():any{
    this.geolocation.getCurrentPosition().then(response => {  
        this.loadMap(response); 
        
    })
    
  }

  loadMap(position: Geoposition){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    // console.log(latitude, longitude);
    
    // create a new map by passing HTMLElement
    let mapEle: HTMLElement = document.getElementById('map');
  
    // create LatLng object
    let myLatLng = {lat: latitude, lng: longitude};
  
  // create map
  this.map = new google.maps.Map(mapEle, {
    center: myLatLng,
    zoom: 17
  });
  
  google.maps.event.addListenerOnce(this.map, 'idle', () => {
       this.marker = new google.maps.Marker({
        position: myLatLng,
        map: this.map
      });
      // console.log(myLatLng);
    
    
    mapEle.classList.add('show-map');
  });
  }

  setMyMap(res: LocationTrackerProvider, map, marker) {
    let myLatLng = {lat: res.lat, lng: res.lng};
    if (marker) {
      // console.log('setnullmap:'+marker)
      marker.setMap(null);
      this.marker = new google.maps.Marker({
        position: myLatLng,
        map: map
      });
    }
    
    map.setCenter(myLatLng);
    map.panTo(myLatLng);
     console.log('marker cambiado a :'+ myLatLng.lat + ' ' + myLatLng.lng);
     
    // this.sendCoords(latLng);
 
  }
}
