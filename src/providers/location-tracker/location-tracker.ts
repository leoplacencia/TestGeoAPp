import {Injectable, NgZone} from '@angular/core';
import {BackgroundGeolocation, BackgroundGeolocationConfig} from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { Http, Headers } from '@angular/http';


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
    public http: Http
  ) {

  }

  public startTracking() {

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
      

      // Update inside of Angular's zone
      this.zone.run(() => {
        this.lat = location.latitude;
        this.lng = location.longitude;
      });
    }, (err) => {
      console.log(err);
      });

    this.backgroundGeolocation.start();

    // Background tracking
    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };

    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
      if (this.test){
        console.log(position);
      };
      
      this.zone.run(() => {
        this.sendPost(position);
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
    });
  }

  sendPost(position){
     // Post
    let headers = new Headers();
    let latLng = {lat: position.coords.latitude, lng: position.coords.longitude};
    headers.append('Content-Type', 'application/json');
    this.http.post('http://localhost:8080/api/test', JSON.stringify(latLng), {headers: headers})
      .map(res => res.json())
      .subscribe(data => {
        if (this.test){
          console.log(data);
        };
    });
  }

  public stopTracking() {
    if (this.test){
      console.log('stopTracking');
    };
    this.backgroundGeolocation.finish();
    this.watch.unsubscribe();
  }
}
