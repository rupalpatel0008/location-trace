import { Injectable } from '@angular/core';
import { BackgroundGeolocation, Geolocation, GoogleMapsLatLng, Geocoder } from 'ionic-native';
import { Platform, Events } from 'ionic-angular';

/*
  Generated class for the LocationService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LocationService {
  constructor(
  	public platform: Platform,
  	public events: Events) {
    console.log('Hello LocationService Provider');

  }

  getCurrentLocation() {
    let promise = new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition().then(response => {
        resolve(response);
      }).catch(err => {
        console.log('Error in getting current location', err);
        reject(err);
      });
    });
    return promise;
  }

  getLocationName(latitude, longitude) {
    let promise = new Promise<any>((resolve, reject) => {
      let place = new GoogleMapsLatLng(latitude, longitude);
      Geocoder.geocode({'position': place}).then(placename => {
        if(placename !== undefined) {
          let address = [
                placename[0].subThoroughfare || '',
                placename[0].thoroughfare || '',
                placename[0].subLocality || '',
                placename[0].locality || '',
                placename[0].adminArea || '',
                placename[0].postalCode || '',
                placename[0].country || ''].join(', ');
          if(address.charAt(0) == ',') {
            address = address.slice(1, address.length);
            resolve(address);
          } else {
            resolve(address);
          }
        } else {
          console.log('placename err', placename);
          reject(placename);
        }
      }).catch(err => {
        console.log('for index',length, 'location err:', err);
        reject(err);
      });
    });
    return promise;
  }

  calculateDistanceBetweenPoints(lat1, lon1, lat2, lon2) {
    var R = 6371; // Earth radius in km
    var dLat = this.degreeToRadian(lat2 - lat1); // Distance between latitudes in radian
    var dLon = this.degreeToRadian(lon2 - lon1); // Distance between longitudes in radian
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.degreeToRadian(lat1)) * Math.cos(this.degreeToRadian(lat2)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    var d = R * c;
    console.log('Calulated '+d+ 'for '+lat1+' '+lon1+', '+lat2+' '+lon2);
    return d;
    //   var distance = Math.acos(Math.sin(lat1)*Math.sin(lat2)+Math.cos(lat1)*Math.cos(lat2)*Math.cos(lng2-lng1))*6371;
    //   console.log('cosine formula', Number(distance));
    //   return  Number(d);
  }

  degreeToRadian(deg) {
    return deg * Math.PI/180;
  }
  watchLocation() {
  	let config = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      debug: true, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: false, // enable this to clear background location settings when the app terminates
      url: 'http://192.168.1.117:3000/locations'
    };
		BackgroundGeolocation.configure(location => {
			console.log('BackgroundGeolocation location', location.latitude, location.longitude);
		}, err => {
			console.log('Err in BackgroundGeolocation.configure');
		}, config);

		BackgroundGeolocation.start();
  }

  getAllLocations() {
  	return BackgroundGeolocation.getLocations();
  }

  stopTracking() {
    return BackgroundGeolocation.stop();
  }

  clearLocations() {
    BackgroundGeolocation.finish();
  }

  checkStationaryLocation() {
    BackgroundGeolocation.onStationary().then(data => {
      console.log('checkStationaryLocation:',data);
      this.events.publish('location:stationary', data);
    }).catch(err => {
      console.log('Error in checkStationaryLocation');
    });
  }

  startTracking() {
    // BackgroundGeolocation is highly configurable. See platform specific configuration options
    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 10,
      distanceFilter: 20,
      debug: true, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: false, // enable this to clear background location settings when the app terminates
      url: 'http://192.168.1.117:3000/locations',
      pauseLocationUpdates: false
    };

    BackgroundGeolocation.configure((location) => {
      console.log('BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude);

      // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
      // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
      // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
      // BackgroundGeolocation.finish(); // FOR IOS ONLY

     }, (error) => {
       console.log('BackgroundGeolocation error');
     }, config);

    // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
    BackgroundGeolocation.start();
  }
}
