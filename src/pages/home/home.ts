import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Http, Headers, RequestOptions } from '@angular/http';


declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  map: any;
  marker: any;
  watch: any;
  

  constructor(public navCtrl: NavController, public geolocation: Geolocation, public locationTracker: LocationTrackerProvider,
    public backgroundMode: BackgroundMode,
    public http: Http) {
  
    

  }
  ionViewDidLoad(){
    // Inicializa el mapa
    this.getPosition();
  }
  public start() {
    
    this.locationTracker.startTracking(); 
    
    // Start Provider background location
    // this.locationTracker.startTracking();
    // Cambia el marker del mapa
    this.backgroundMode.on('activate').subscribe(() => {
      this.watch = this.geolocation.watchPosition().subscribe(res =>{
        
        this.sendPost(res)
        console.log('Segundo plano');
      });
    });
    this.watch = this.geolocation.watchPosition().subscribe(res =>{
      this.setMyMap(this.locationTracker,this.map,this.marker);
      this.sendPost(res)
      console.log('Cambió marker');
    });
    this.backgroundMode.enable();
    
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





  sendPost(res){
    // Post
   let headers = new Headers();
   // 
   
   let latLng = {lat: res.lat, lng: res.lng};
   //let latLng = position.coords.latitude + ' '+ position.coords.longitude;
   //
   headers.append('Content-Type', 'application/json');
   headers.append('Access-Control-Allow-Origin', '*');
   let sendUrl = 'http://192.168.43.167:3001/save_coordinates';
   let authUrl = 'http://192.168.43.167:3001/users/sign_in';
   let testUrl = 'http://192.168.100.140:8080/api/test'
   let user = {
     email: 'secheverria@moldeable.com',
     password: 'molde1313'
   };
   // console.log(JSON.stringify(user));


   this.http.post(testUrl, JSON.stringify(latLng),  new RequestOptions({headers: headers}) )
   .map(res => res.json())
   .subscribe(data => {
    console.log(data);
     
   });

   /*
   this.http.post(sendUrl, JSON.stringify(latLng), {headers: headers})
   .map(res => res.json())
   .subscribe(data => {
     if (this.test){
       console.log(data);
     };
   });*/




   // this.http.post("//192.168.43.167:3001/save_coordinates", JSON.stringify(latLng), new RequestOptions({ headers: headers }))
   // .map(res => res.json());
   
   // this.http.post('http://192.168.43.167:3001/save_coordinates', latLng, {headers: headers})
     
   //   .subscribe();

   // this.http.post('http://192.168.43.167:3001/save_coordinates', latLng, {headers: headers})
     
   //   .subscribe(data => {
   //     if (this.test){
   //       console.log(data);
   //     };
   // });
   //  }
 }
}
