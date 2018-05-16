import {Injectable, NgZone} from '@angular/core';
import {BackgroundGeolocation, BackgroundGeolocationConfig} from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { Http, Headers, RequestOptions } from '@angular/http';
import { BackgroundMode } from '@ionic-native/background-mode';



@Injectable()
export class LocationTrackerProvider {

  public watch: any;
  public lat: any;
  public lng: any;
  test: boolean = true;
  


  constructor(
    public zone: NgZone,
    public backgroundGeolocation: BackgroundGeolocation,
    public geolocation: Geolocation,
    public http: Http,
    public backgroundMode: BackgroundMode
    ) { 

   }

  public startTracking() {

    this.backgroundMode.enable();
    let config : BackgroundGeolocationConfig = {
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 10,
      debug: true,
      interval: 2000
    };

    this.backgroundGeolocation.configure(config).subscribe((location) => {
    
      if (this.test){
        console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);
      };
      

      // Asigna coords para ser leidas
      this.zone.run(() => {
        this.lat = location.latitude;
        this.lng = location.longitude;
      });
    }, (err) => {
      console.log(err);
      });

    this.backgroundGeolocation.start();

    // Background coords
    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };

    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
      if (this.test){
        console.log(position);
      };
      this.sendPost(position);
      this.zone.run(() => {
        
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
    });
  }

  sendPost(position){
     // Post
    let headers = new Headers();
    // 
    
    let latLng = {lat: position.coords.latitude, lng: position.coords.longitude};
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
      if (this.test){
        console.log(data);
      };
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
  public stopTracking() {
    if (this.test){
      console.log('stopTracking');
    };
    this.backgroundGeolocation.finish();
    this.watch.unsubscribe();
    this.backgroundMode.disable();
  }
}
