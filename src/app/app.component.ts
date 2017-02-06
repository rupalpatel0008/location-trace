import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { HomePage } from '../pages/home/home';
import { BackgroundGeolocation } from 'ionic-native';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = HomePage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // BackgroundGeolocation is highly configurable. See platform specific configuration options
      let config = {
              desiredAccuracy: 0,
              stationaryRadius: 10,
              distanceFilter: 20,
              debug: true, //  enable this hear sounds for background-geolocation life-cycle.
              stopOnTerminate: false, // enable this to clear background location settings when the app terminates
      };

      BackgroundGeolocation.configure((location) => {
           console.log('[js] BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude);

            // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
            // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
            // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
            // BackgroundGeolocation.finish(); // FOR IOS ONLY

       }, (error) => {
         console.log('BackgroundGeolocation error');
       }, config);

      // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
      BackgroundGeolocation.start();
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
