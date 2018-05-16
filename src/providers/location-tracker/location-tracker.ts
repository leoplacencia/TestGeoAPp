import {Injectable, NgZone} from '@angular/core';
import {BackgroundGeolocation, BackgroundGeolocationConfig} from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';




@Injectable()
export class LocationTrackerProvider {

  public watch: any;
  public lat: any;
  public lng: any;
  test: boolean = true;
  


  constructor(
    public zone: NgZone,
    public backgroundGeolocation: BackgroundGeolocation,
    public geolocation: Geolocation
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
      //this.sendPost(position);
      this.zone.run(() => {
        
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
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
