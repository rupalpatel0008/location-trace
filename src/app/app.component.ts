import { Component } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { StatusBar, BackgroundGeolocation } from 'ionic-native';
import { HomePage } from '../pages/home/home';
import { LocationService } from '../providers/location-service';
import { Utils } from '../providers/utils';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = HomePage;

  constructor(platform: Platform,
    events: Events,
    public locationService: LocationService,
    public utils: Utils) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.locationService.startTracking();
      StatusBar.styleDefault();
      // this.addGoogleMapsJS();
      // Splashscreen.hide();
      setTimeout(() => {
        BackgroundGeolocation.isLocationEnabled().then(data => {
          if(data == 1) {
            console.log('location enabled', data);
          } else {
            BackgroundGeolocation.showLocationSettings();
          }
        }).catch(err => {
          console.log('location not enabled', err);
          BackgroundGeolocation.showLocationSettings();
        });
      },1);
      setTimeout(() => {
        this.locationService.startTracking();
      }, 10);
  });
  }
}
